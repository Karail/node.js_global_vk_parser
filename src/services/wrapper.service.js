


class WrapperService {
    get(clb) {
        try {

            const arr = [
            ]

            let num = 100

            let count = 1000;
            let offset = 0;
            let i = 1;
            let k = 0
            let timer = setInterval(async () => {
                offset = await clb(arr[k], i, offset, count)
                if (offset === 0)
                    i++;
                k++;
                if (i >= num)
                    clearInterval(timer);
                if (k >= arr.length)
                    k = 0;
            }, 250);

        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new WrapperService();