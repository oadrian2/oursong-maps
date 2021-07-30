import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { Point } from '../app/math';
import { MapID, Ruler, UserID } from '../map/State';
import { Token, TokenID } from '../map/tokenSlice';

type Handler = (...args: any[]) => void;

export class MapApi {
  readonly connection: HubConnection;

  private mapId: MapID | null = null;

  #connectionHandlers: Handler[] = [];
  #userListHandlers: Handler[] = [];
  #connectedIds = new Set<string>();

  readonly #userID = new Subject<UserID>();
  readonly #userList = new BehaviorSubject<UserID[]>([]);
  readonly #tokenList = new BehaviorSubject<TokenID[]>([]);
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

      console.info(this.#tokenList.value);

      this.#tokenList.next([...new Set([...this.#tokenList.value, token.id])]);

      console.info(this.#tokenList.value);
    });

    this.connection.on('pingUpdated', (mapId, ping) => {
      if (!this.#mapMatches(mapId, this.mapId!)) return;

      this.#pingChanges.next([ping.id, ping]);
    });

    this.connection.on('worldState', (worldState: { tokens: Token[] }) => {
      const { tokens } = worldState;

      this.#tokenList.next(tokens.map(({ id }) => id));
    });

    // this.connection.start();
  }

  #mapMatches(a: MapID, b: MapID) {
    return a.game === b.game && a.id === b.id;
  }

  ///

  readonly rulerChanges = this.#rulerChanges.asObservable();

  readonly tokenChanges = this.#tokenChanges.asObservable();

  readonly pingChanges = this.#pingChanges.asObservable();

  ///

  async connect() {
    await this.connection.start();

    this.#connectionHandlers.forEach((h) => h(this.connection.connectionId));
  }

  async joinMap(game: string, id: string) {
    await this.connection.invoke('joinMap', game, id);

    this.mapId = { game, id };
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

    await this.connection.invoke('updatePing', this.mapId, { id: userID, ...ping }, new Date());
  }

  async updateToken(tokenID: TokenID, token: Token) {
    this.#mapJoinedGuard();

    await this.connection.invoke('updateToken', this.mapId, { /* id: tokenID, */ ...token }, new Date());
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
