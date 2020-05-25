


class WrapperService {
    get(clb) {
        try {

            const token = '0b994e373936ad06b4c5d9736bc5d6c64aa6a5b76880342087dd24ddcec24417576ac4a72b55365deb956';

            let countOperation = 1200;

            let countQuery = 1000;

            let offset = 0;
            
            let i = 1;

            let timer = setInterval(async () => {
                offset = await clb(token, i, offset, countQuery)
                if (offset === 0)
                    i++;
                if (i >= countOperation)
                    clearInterval(timer);
            }, 3000);

        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new WrapperService();