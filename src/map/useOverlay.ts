import { useRecoilValue } from "recoil";
import { fullTokenState, TokenID } from "../app/tokenState";

export function useOverlay(selfTokenID: TokenID) {
    const {
        position: selfPosition,
        facing: selfFacing,
        shape: { baseSize: selfBaseSize },
        generator: selfGeneratorId,
      } = useRecoilValue(fullTokenState(selfTokenID))!;
}