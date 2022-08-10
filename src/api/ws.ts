import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable, shareReplay, Subject } from 'rxjs';
import { MapID } from '../app/mapState';
import { Campaign, CampaignID, Generator, Map, Point, Ruler, Token, TokenColor, TokenID, UserID } from './types';

type Handler = (...args: any[]) => void;

export class MapApi {
  readonly connection: HubConnection;

  private mapId: MapID | null = null;

  #connectionHandlers: Handler[] = [];
  #userListHandlers: Handler[] = [];
  #connectedIds = new Set<string>();
  #tokenCache: StorageToken[] | null = null;

  readonly #userID = new Subject<UserID>();
  readonly #userList = new BehaviorSubject<UserID[]>([]);
  readonly #tokenListChanges = new BehaviorSubject<TokenID[]>([]);
  readonly #rulerChanges = new Subject<[UserID, Ruler]>();
  readonly #tokenChanges = new Subject<[TokenID, Token]>();
  readonly #pingChanges = new Subject<[UserID, Point]>();

  /**
   *
   */
  constructor(endpoint: string) {
    // prettier-ignore
    this.connection = new HubConnectionBuilder()
      .withUrl(endpoint)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Debug)
      .build();

    this.connection.on('rulerUpdated', (mapId, { id }) => {
      if (!this.#mapMatches(mapId, this.mapId!)) return;

      if (id !== this.userId) {
        this.#onUserConnected(id);
      }
    });

    this.connection.on('rulerUpdated', (mapId, ruler) => {
      if (!this.#mapMatches(mapId, this.mapId!)) return;

      this.#rulerChanges.next([ruler.id, ruler]);
    });

    this.connection.on('tokenUpdated', (mapId, token) => {
      if (!this.#mapMatches(mapId, this.mapId!)) return;

      this.#tokenChanges.next([token.id, token]);
      this.#tokenListChanges.next([...new Set([...this.#tokenListChanges.value, token.id])]);
    });

    this.connection.on('pingUpdated', (mapId, ping) => {
      if (!this.#mapMatches(mapId, this.mapId!)) return;

      this.#pingChanges.next([ping.id, ping]);
    });

    this.connection.on('worldState', (worldState: { id: string; game: string; tokens: StorageToken[] }) => {
      const { id, game, tokens } = worldState;

      if (!this.#mapMatches({ id, game }, this.mapId!)) return;

      this.#tokenCache = tokens;

      this.#tokenListChanges.next(tokens.map(({ id }) => id));
    });
  }

  #mapMatches(a: MapID, b: MapID) {
    return a.game === b.game && a.id === b.id;
  }

  ///

  readonly tokenListChanges: Observable<TokenID[]> = this.#tokenListChanges.pipe(shareReplay(1));

  readonly rulerChanges: Observable<[UserID, Ruler]> = this.#rulerChanges.pipe(shareReplay(1));

  readonly tokenChanges: Observable<[TokenID, Token]> = this.#tokenChanges.pipe(shareReplay(1));

  readonly pingChanges: Observable<[UserID, Point]> = this.#pingChanges.pipe(shareReplay(1));

  readonly userListChanges: Observable<UserID[]> = this.#userList.pipe(shareReplay(1));

  ///

  async connect() {
    await this.connection.start();

    this.#onUserConnected(this.connection.connectionId!);

    this.#connectionHandlers.forEach((h) => h(this.connection.connectionId));
  }

  async joinMap(game: string, id: string) {
    this.mapId = { game, id };

    await this.connection.invoke('joinMap', game, id);
  }

  async leaveMap() {
    if (this.mapId === null) throw new MapNotJoinedError();

    await this.connection.invoke('leaveMap', this.mapId);

    this.mapId = null;
  }

  updateRuler(ruler: Ruler) {
    if (this.mapId === null) throw new MapNotJoinedError();

    this.connection.invoke('updateRuler', this.mapId, { id: this.userId, ...ruler }, new Date());
  }

  updatePing(ping: Point) {
    if (this.mapId === null) throw new MapNotJoinedError();

    this.connection.invoke('updatePing', this.mapId, { id: this.userId, ...ping });
  }

  async updateToken(tokenID: TokenID, token: Token) {
    if (this.mapId === null) throw new MapNotJoinedError();

    const storageToken: StorageToken = { id: tokenID, map: this.mapId.id, game: this.mapId.game, ...mapTokenToStorageToken(token) };

    await this.connection.invoke('updateToken', this.mapId, { ...storageToken });
  }

  async getToken(tokenID: TokenID): Promise<Token> {
    if (this.mapId === null) throw new MapNotJoinedError();

    const cachedToken = this.#tokenCache?.find((t) => t.id === tokenID);

    if (cachedToken) {
      return mapStorageTokenToToken(cachedToken);
    }

    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/token/${this.mapId.game}/${tokenID}`);

    if (response.status !== 200) throw Error('Augh!');

    const storageToken: StorageToken = await response.json();

    return mapStorageTokenToToken(storageToken);
  }

  async getTokens(): Promise<TokenID[]> {
    if (this.mapId === null) throw new MapNotJoinedError();

    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/map/${this.mapId.game}/${this.mapId.id}/tokens`);

    if (response.status !== 200) throw Error('Augh!');

    const tokens = await response.json();

    this.#tokenCache = tokens;

    return tokens.map(({ id }: { id: TokenID }) => id);
  }

  async getMap(mapId: MapID): Promise<Map> {
    // TODO: Fix the eary request
    // if (this.mapId === null) throw new MapJoinError();

    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/maps/${mapId!.game}/${mapId!.id}`);

    if (response.status !== 200) throw Error('Augh!');

    const storageMap = await response.json();

    return mapStorageMapToMap(storageMap);
  }

  async getCampaign(campaignId: CampaignID): Promise<Campaign> {
    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/campaigns/${campaignId}`);

    if (response.status !== 200) throw Error('Augh!');

    const storageCampaign = await response.json();

    return storageCampaign;
  }

  async getMapsByCampaign(campaignId: CampaignID): Promise<Map[]> {
    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/campaigns/${campaignId}/maps`);

    if (response.status !== 200) throw Error('Augh!');

    const storageMaps = await response.json();

    return storageMaps.map(mapStorageMapToMap);
  }

  async getCampaigns(): Promise<Campaign[]> {
    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/campaigns`);

    if (response.status !== 200) throw Error('Augh!');

    const storageCampaigns = await response.json();

    return storageCampaigns;
  }

  onConnected(handler: Handler) {
    this.#connectionHandlers.push(handler);
  }

  offConnected(handler: Handler) {
    const removeIdx = this.#userListHandlers.indexOf(handler);

    if (removeIdx !== -1) {
      this.#userListHandlers.splice(removeIdx, 1);
    }
  }

  onUserListUpdated(handler: Handler) {
    this.#userListHandlers.push(handler);
  }

  offUserListUpdated(handler: Handler) {
    const removeIdx = this.#userListHandlers.indexOf(handler);

    if (removeIdx !== -1) {
      this.#userListHandlers.splice(removeIdx, 1);
    }
  }

  #onUserConnected(id: string) {
    this.#connectedIds.add(id);

    const connectionIds = Array.from(this.#connectedIds);

    this.#userListHandlers.forEach((h) => h(connectionIds));
  }

  get userId(): string | null {
    return this.connection.connectionId;
  }
}

class MapNotJoinedError extends Error {
  /**
   *
   */
  constructor() {
    super('Must join a map before interacting with map data.');
  }
}

function mapTokenToStorageToken(token: Token): Omit<StorageToken, 'id' | 'game' | 'map'> {
  const { generator, position, deleted, visible, active, facing, path, shape, notes, tags } = token;

  return {
    generator,
    position,
    deleted,
    visible,
    active,
    facing,
    path,
    shape,
    notes,
    tags,
  };
}

function mapStorageTokenToToken(token: Omit<StorageToken, 'id' | 'game' | 'map'>): Token {
  const {
    generator,
    position = null,
    deleted = false,
    visible = true,
    active = true,
    facing = null,
    path = [],
    shape,
    notes = '',
    tags = [],
  } = token;

  const parsedColor = fromColorToColor(shape?.color);

  return {
    generator,
    position,
    deleted,
    visible,
    active,
    facing,
    path,
    shape: {
      ...(parsedColor && { color: parsedColor }),
      ...(shape?.baseSize && { baseSize: shape.baseSize }),
      ...(shape?.auraSize && { auraSize: shape.auraSize }),
    },
    notes,
    tags,
  };
}

function mapStorageMapToMap(map: StorageMap): Map {
  const { generators, ...restMap } = map;

  return {
    ...restMap,
    generators: generators.map(mapStorageGeneratorToGenerator),
  };
}

function mapStorageGeneratorToGenerator(generator: StorageGenerator): Generator {
  const {
    name,
    shape: { label, color, baseSize, isGroup },
    ...restGenerator
  } = generator;

  return {
    ...restGenerator,
    name,
    shape: {
      type: 'figure',
      label,
      color: fromColorToColor(color),
      isGroup,
      baseSize,
    },
  };
}

export const api = new MapApi(process.env.REACT_APP_HUB_URL!);

type StorageToken = {
  id: string;
  generator: string;
  position?: {
    x: number;
    y: number;
  } | null;
  game: string;
  map: string;
  path?: { x: number; y: number }[];
  facing?: number | null;
  active?: boolean;
  deleted?: boolean;
  visible?: boolean;
  shape?: {
    color?: StorageColor;
    baseSize?: number;
    auraSize?: number;
  };
  notes?: string;
  tags?: string[];
};

type StorageFigureGenerator = {
  id: string;
  name: string;
  shape: {
    type: 'figure';
    label: string;
    color: StorageColor;
    isGroup: boolean;
    baseSize: number;
  };
};

type StorageGenerator = StorageFigureGenerator;

type StorageMap = {
  id: string;
  game: string;
  map: {
    image: string;
    scale: number;
    width: number;
    height: number;
  };
  title: string;
  generators: StorageGenerator[];
};

type StorageColor = keyof typeof TokenColor;

function fromColorToColor(color: StorageColor): TokenColor;
function fromColorToColor(color: StorageColor | undefined): TokenColor | undefined;
function fromColorToColor(color: StorageColor | undefined): TokenColor | undefined {
  switch (color) {
    case 'red':
      return TokenColor.red;
    case 'yellow':
      return TokenColor.yellow;
    case 'green':
      return TokenColor.green;
    case 'cyan':
      return TokenColor.cyan;
    case 'blue':
      return TokenColor.blue;
    case 'magenta':
      return TokenColor.magenta;
    default:
      return undefined;
  }
}
