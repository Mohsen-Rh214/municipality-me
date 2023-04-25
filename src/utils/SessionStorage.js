// import AsyncStorage from "@react-native-async-storage/async-storage";

// const key = 'token';
export const getToken = (key) => {

    try{
       return sessionStorage.getItem(key);
        
    }catch(err){
        console.log('get token error',err);
    }
    
}

export const setInStorage = (key , value) => {
    try{
        return sessionStorage.setItem(key , value);
         
     }catch(err){
         console.log('get token error',err);
     }
}

export const removeToken = () => {
    try{
        return sessionStorage.removeItem('token');
         
     }catch(err){
         console.log('remove token error',err);
     }
}


