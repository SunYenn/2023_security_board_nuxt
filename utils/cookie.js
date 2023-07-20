// 쿠키에 데이터를 저장하는 함수
export function setCookie(key, value, min) {
    const date = new Date();
    date.setTime(date.getTime() + (min * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${key}=${value}; ${expires}; path=/`;
  }
  
  // 쿠키에서 데이터를 가져오는 함수
  export function getCookie(key) {
    const name = `${key}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }
  
  // 쿠키에서 데이터를 삭제하는 함수
  export function deleteCookie(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  