
export const parseHash = (hashURL) =>{ 
    let hashes = {}
    hashURL.substring(1).split('&')
        .map((entry)=>{
            hashes[entry.split('=')[0]]=entry.split('=')[1]
    })
    return hashes
}


// below codes are copied onine
export function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
};

export const randomString = (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}