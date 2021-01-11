// Models
import { VkToken } from "../models";
// Services
import { Logger } from "../../shared/services";

export class VkTokenService {
    /**
     * Таймаут поиска токена.
     * По delay возвращает из базы token и обновляет его флаг active
     */
    public async search(): Promise<VkToken> {
        return new Promise((resolve, reject) => {
            const delay = 1000;

            const timer = setTimeout(run.bind(this), delay);

            async function run(this: VkTokenService) {
                try {
                    const token = await VkToken.findOne({ where: { active: false } });

                    if (token) {
                        Logger.info('token exist');
                        // token.update({ active: true });
                        clearTimeout(timer);
                        resolve(token);
                    }
                    else {
                        Logger.info("token doesn't exist");
                        setTimeout(run.bind(this), delay);
                    }
                } catch (e) {
                    Logger.error(e);
                    reject(e);
                }
            }
        });
    }
}