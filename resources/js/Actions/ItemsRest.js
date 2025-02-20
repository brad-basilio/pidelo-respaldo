import { Fetch } from "sode-extend-react";
import BasicRest from "./BasicRest";

class ItemsRest extends BasicRest {
    path = "items";

    verifyStock = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/verify-stock`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ??
                        "Ocurrió un error al consultar el stock de los productos"
                );
            return result.data ?? [];
        } catch (error) {
            return [];
        }
    };
    verifyCombo = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/combo-items`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ??
                        "Ocurrió un error al consultar el combo de los productos"
                );

            return result.data ?? [];
        } catch (error) {
            return [];
        }
    };
}

export default ItemsRest;
