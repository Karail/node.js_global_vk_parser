


class WrapperService {
    get(clb) {
        try {

            const token = '1b916968c536cee1f448155bf4f167c4b6c6b0d481acde1206fbbb2d823f662606599dc05a067d4d78ce9';

            let countOperation = 100;

            let countQuery = 1000;

            let offset = 0;

            let i = 1;

            const timer = setTimeout(async function run() {
                offset = await clb(token, i, offset, countQuery)
                console.log('------------------------------------------------', offset)
                if (offset === 0)
                    i++;
                if (i >= countOperation)
                    clearTimeout(timer);
                else 
                    setTimeout(run, 2000);
            }, 2000);

        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new WrapperService();