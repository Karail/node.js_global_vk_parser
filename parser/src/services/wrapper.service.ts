


export class WrapperService {
    static get(
        clb: Function,
        token: string,
        i: number,
        countOperation: number
    ) {
        try {

            let countQuery = 1000;

            let offset = 0;

            const timer = setTimeout(async function run() {
                offset = await clb(token, i, offset, countQuery)
                if (offset === 0)
                    i++;
                if (i >= countOperation)
                    clearTimeout(timer);
                else
                    setTimeout(run, 1800);
            }, 1800);

        } catch (err) {
            console.log(err);
        }
    }
}

