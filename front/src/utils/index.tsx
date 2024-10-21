export const strResume = (str: string, size: number, separator: string) => {
    if (str && str.length > size)
        return str.slice(0, size / 2) + separator + str.slice(str.length - size / 2);
}

export const displayDate = (dateStr: string, withHours = false, dateObj = null) => {
    if (!dateStr && !dateObj)
        return '';
    // const monthNamesFull = ["January", "February", "March", "April", "May", "June",
    //     "July", "August", "September", "October", "November", "December"
    // ];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const myDate = !dateObj ? new Date(parseInt(dateStr)) : dateObj;
    const fullDate = monthNames[myDate.getMonth()] + ' '
        + ('0' + myDate.getDate()).slice(-2) + ', ' +
        + myDate.getFullYear();

    /*const fullDate = ('0' + (myDate.getMonth() + 1)).slice(-2) + '/'
      + ('0' + myDate.getDate()).slice(-2) + '/' + 
      + myDate.getFullYear();*/
    const fullHours = ('0' + myDate.getHours()).slice(-2)
        + ':' + ('0' + myDate.getMinutes()).slice(-2)
        + ':' + ('0' + myDate.getSeconds()).slice(-2);
    return fullDate + (withHours ? ' ' + fullHours : '');
}

export const buildRequest = async (url: string, method: string, body?: any) => {
    const data = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: method !== "GET" ? JSON.stringify(body) : null,
    })
        .then((response) => response.json())
        .then((response) => {
            if (!response) throw new Error("Request Fail");
            else if (response.code) {
                throw new Error(response.message);
            }
            return response;
        });

    return data;
};

export const obj1HaveOrSupObj2 = (obj1: any, obj2: any) => {
    const keys = Object.keys(obj2);
    for (let i = 0; i < keys.length; i++)
        if (obj1[keys[i]] === undefined || obj1[keys[i]] < obj2[keys[i]])
            return false;
    return true;
}

export const unPad = (str: string) => {
    if (!str) return str;
    let i = 0;
    while (i < str.length && str[i] === '0')
        i++;
    return str.slice(i, str.length);
}

export const doPad = (str: string, size: number) => {
    if (!str) return str;
    return str.padStart(size).replaceAll(' ', '0')
}

// Haversine formula
export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}


export const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    const lastValue = parts.pop();
    if (parts.length === 2 && lastValue) return lastValue.split(';').shift();
}


type ObjCollide = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export const isCollide = (a: ObjCollide, b: ObjCollide) => {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

// Game mode
export const enumStep = { victory: 2, fail: 3 };

export const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const random = (max: number) => Math.floor(Math.random() * max);
export const findRandom = (playerCenter: number[], width: number, height: number, size: number) => {
    let newX = random(width);
    let newY = random(height);
    const offset = 50;

    if (Math.abs(playerCenter[0] - newX) <= offset + size)
        newX = width - playerCenter[0];
    if (Math.abs(playerCenter[1] - newY) <= offset + size)
        newY = height - playerCenter[1];
    return [newX < 0 ? 0 : newX, newY < 0 ? 0 : newY];
}

export const shortString = (text: string) => {
    return text.slice(0, 3) + '...' + text.slice(-3);
}


export const calculateDistance = (player: number[], coord: number[]) => {
    const playerX = player[0];
    const playerY = player[1];
    const wifiX = coord[0];
    const wifiY = coord[1];
    const distance = Math.sqrt((Math.pow(wifiX - playerX, 2)) + (Math.pow(wifiY - playerY, 2)));
    return 5 - parseInt('' + distance / 100);
}

export const getHour = () => {
    const d = new Date();
    const hour = ('0' + d.getHours()).slice(-2)
        + ':' + ('0' + d.getMinutes()).slice(-2);
    return hour;
}

export const shuffle = (array: any) => {
    let currentIndex = array.length, temporaryValue, randomIndex, arrayCopy;

    arrayCopy = array.slice();
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = arrayCopy[currentIndex];
        arrayCopy[currentIndex] = arrayCopy[randomIndex];
        arrayCopy[randomIndex] = temporaryValue;
    }

    return arrayCopy;
}

export const levelDisplay = (xp: number, coef: number, max?: number) => {
    if (xp === 0) return 0;
    const res = parseInt((coef * Math.log(xp)) + '');
    return max && res > max ? max : res;
};

export const makeid = (length: number) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const replaceParametersInUrl = (url: string, params: { [key: string]: string }) => {
    var newObj: { [key: string]: string } = {};
    Object.keys(params).forEach(function (key) {
        newObj[':' + key] = params[key];
    });

    var regex = new RegExp(Object.keys(newObj).join('|'), 'gi');
    return url.replace(regex, function (matched) {
        return newObj[matched];
    });
}

// get index in a loopable options scenario
export const getKeyChained = (totalSize: number, nextOne: number, current: number) => {
    if (nextOne > 0) { return (current + nextOne) % totalSize; }
    return (current + nextOne) < 0 ? totalSize + nextOne : current + nextOne;
}