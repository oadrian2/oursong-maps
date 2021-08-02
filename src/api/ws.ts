import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, shareReplay, Subject } from 'rxjs';
import { MapID } from '../app/mapState';
import { Point } from '../app/math';
import { Ruler } from '../app/rulerState';
import { PartitionedID } from '../app/state';
import { Token, TokenID } from '../app/tokenState';
import { UserID } from '../app/userState';

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

      this.#onUserConnected(id);
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

    // this.connection.start();
  }

  #mapMatches(a: MapID, b: MapID) {
    return a.game === b.game && a.id === b.id;
  }

  ///

  readonly tokenListChanges = this.#tokenListChanges.pipe(shareReplay(1));

  readonly rulerChanges = this.#rulerChanges.pipe(shareReplay(1));

  readonly tokenChanges = this.#tokenChanges.pipe(shareReplay(1));

  readonly pingChanges = this.#pingChanges.pipe(shareReplay(1));

  ///

  async connect() {
    await this.connection.start();

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

  async updateRuler(userID: UserID, ruler: Ruler) {
    this.#mapJoinedGuard();

    await this.connection.invoke('updateRuler', this.mapId, { id: userID, ...ruler }, new Date());
  }

  async updatePing(userID: UserID, ping: Point) {
    this.#mapJoinedGuard();

    await this.connection.invoke('updatePing', this.mapId, { id: userID, ...ping });
  }

  async updateToken(tokenID: TokenID, token: Token) {
    console.info(tokenID, token);

    this.#mapJoinedGuard();

    await this.connection.invoke('updateToken', this.mapId, { id: tokenID, ...token });
  }

  async getToken(tokenID: TokenID): Promise<any> {
    this.#mapJoinedGuard();

    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/token/${this.mapId!.game}/${tokenID}`);

    if (response.status !== 200) throw Error('Augh!');

    return response.json();
  }

  async getTokens(): Promise<string[]> {
    this.#mapJoinedGuard();

    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/map/${this.mapId!.game}/${this.mapId!.id}/tokens`);

    if (response.status !== 200) throw Error('Augh!');

    const tokens = await response.json();

    return tokens.map(({ id }: { id: string }) => id);
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

export const api = new MapApi(process.env.REACT_APP_HUB_URL!);
