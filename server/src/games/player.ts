import { AuthRequest, AuthResponse, ELoginType } from "./models/game_req/auth";
import { GameServiceConfig } from "./models/game_req/game";
import AuthService from "./services/auth_service";
import BCLogService from "./services/bclog_service";
import GameService from "./services/game_services";

export default class Player {
  _gameService: GameService;
  _bcService: BCLogService;

  private constructor(private _authData: AuthResponse) {
    const gameData: GameServiceConfig = {
      uid: this._authData.uid,
      skey: this._authData.skey,
      mtkey: this._authData.mtkey,
      deviceToken: this._authData.deviceToken,
    };
    this._gameService = new GameService(gameData);
    this._bcService = new BCLogService();
  }

  static async create(auth: AuthRequest) {
    const authService = new AuthService();
    const authResponse = await authService.login(auth).catch((res) => null);
    if (!authResponse) {
      return null;
    }

    const instance = new Player(authResponse);
    return instance;
  }
}
