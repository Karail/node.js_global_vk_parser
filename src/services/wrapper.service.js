


class WrapperService {
    get(clb) {
        try {

            const token = 'cb3798a19ae8466f105a19bfba29e869366d2eb9647ca94ad98a97df56754ea24bf562b886debc80e8bd1';

            let countOperation = 25;

            let countQuery = 10;

            let offset = 0;
            
            let i = 1;

            let timer = setInterval(async () => {
                offset = await clb(token, i, offset, countQuery)
                if (offset === 0)
                    i++;
                if (i >= countOperation)
                    clearInterval(timer);
            }, 2000);

        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new WrapperService();