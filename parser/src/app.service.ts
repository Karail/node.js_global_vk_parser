// Services
import { VkGroupService, VkTokenService } from "./group/services";
import { Logger } from "./shared/services";

export class AppService {

    private readonly vkGroupService = new VkGroupService();
    private readonly vkTokenService = new VkTokenService();

    constructor() {
        this.init();
    }

    /**
     * метод запускается при инициализации класса
     */
    private async init() {
        try {
            const token = await this.vkTokenService.search();
        
            if (token) {
                this.vkGroupService.parse(token.hash, Number(process.env.ID_AT), Number(process.env.ID_TO) );
            }
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    }
}