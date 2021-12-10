import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable, shareReplay, Subject } from 'rxjs';
import { MapID } from '../app/mapState';
import { Generator, Map, PartitionedID, Point, Ruler, Token, TokenColor, TokenID, UserID } from './types';

type Handler = (...args: any[]) => void;

export class MapApi {
  readonly connection: HubConnection;

  private mapId: MapID | null = null;

  #connectionHandlers: Handler[] = [];
  #userListHandlers: Handler[] = [];
  #connectedIds = new Set<string>();

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

    this.connection.on('worldState', (worldState: { tokens: (Token & PartitionedID)[] }) => {
      const { tokens } = worldState;

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
    this.#mapJoinedGuard();

    await this.connection.invoke('leaveMap', this.mapId);

    this.mapId = null;
  }

  updateRuler(userID: UserID, ruler: Ruler) {
    this.#mapJoinedGuard();

    this.connection.invoke('updateRuler', this.mapId, { id: userID, ...ruler }, new Date());
  }

  async updatePing(userID: UserID, ping: Point) {
    this.#mapJoinedGuard();

    await this.connection.invoke('updatePing', this.mapId, { id: userID, ...ping });
  }

  async updateToken(tokenID: TokenID, token: Token) {
    console.info(tokenID, token);

    this.#mapJoinedGuard();

    const storageToken: StorageToken = { id: tokenID, map: this.mapId!.id, game: this.mapId!.game, ...mapTokenToStorageToken(token) };

    await this.connection.invoke('updateToken', this.mapId, { ...storageToken });
  }

  async getToken(tokenID: TokenID): Promise<Token> {
    this.#mapJoinedGuard();

    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/token/${this.mapId!.game}/${tokenID}`);

    if (response.status !== 200) throw Error('Augh!');

    const storageToken: StorageToken = await response.json();

    return mapStorageTokenToToken(storageToken);
  }

  async getTokens(): Promise<TokenID[]> {
    this.#mapJoinedGuard();

    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/map/${this.mapId!.game}/${this.mapId!.id}/tokens`);

    if (response.status !== 200) throw Error('Augh!');

    const tokens = await response.json();

    return tokens.map(({ id }: { id: TokenID }) => id);
  }

  async getMap(mapId: MapID): Promise<Map> {
    // this.#mapJoinedGuard();

    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/maps/${mapId!.game}/${mapId!.id}`);

    if (response.status !== 200) throw Error('Augh!');

    const storageMap = await response.json();

    return mapStorageMapToMap(storageMap);
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

  #mapJoinedGuard() {
    if (!this.mapId) throw new Error('Must join a map before interacting with map data.');
  }
}

function mapTokenToStorageToken(token: Token): Omit<StorageToken, 'id' | 'game' | 'map'> {
  const { generator, position, deleted, visible, active, facing, path, shape } = token;

  return {
    generator,
    position,
    deleted,
    visible,
    active,
    facing,
    path,
    shape,
  };
}

function mapStorageTokenToToken(token: Omit<StorageToken, 'id' | 'game' | 'map'>): Token {
  const { generator, position = null, deleted = false, visible = true, active = true, facing = null, path = [], shape } = token;

  const parsedColor = parseColor(shape?.color);

  return {
    generator,
    position,
    deleted,
    visible,
    active,
    facing,
    path,
    shape: { ...(parsedColor && { color: parsedColor }) },
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
    shape: { allegiance, baseSize = 30.0, ...restShape },
    ...restGenerator
  } = generator;

  return {
    ...restGenerator,
    shape: {
      ...restShape,
      color: toColor(allegiance), // replaces allegiance
      scale: baseSize / 30.0, // replaces baseSize
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
  };
};

type StorageFigureGenerator = {
  id: string;
  shapeType: 'figure';
  shape: {
    prefix: string;
    label: string; // TODO: move out
    allegiance: StorageAllegiance;
    isGroup?: boolean;
    baseSize?: number;
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

type StorageAllegiance = 'ally' | 'enemy' | 'target' | 'unknown';

type StorageColor = keyof typeof TokenColor;

function toColor(allegiance: StorageAllegiance): TokenColor {
  switch (allegiance) {
    case 'enemy':
      return TokenColor.red;
    case 'ally':
      return TokenColor.blue;
    case 'target':
      return TokenColor.yellow;
    case 'unknown':
      return TokenColor.green;
  }
}

function parseColor(color?: keyof typeof TokenColor) {
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
