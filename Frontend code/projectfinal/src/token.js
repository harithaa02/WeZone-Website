function token() {
    const setUser = (token) => {
        try {
            localStorage.setItem('userToken', JSON.stringify(token));
            return true;
        } catch (error) {
            console.error('Error saving token to localStorage:', error);
            return false;
        }
    };

    const getUser = () => {
        try {
         
            const userToken = localStorage.getItem('userToken');
            return userToken ? JSON.parse(userToken) : null;
        } catch (error) {
            console.error('Error parsing token from localStorage:', error);
        
            localStorage.removeItem('userToken');
            return null;
        }
    };

    const clearUser = () => {
       
        localStorage.removeItem('userToken');
    };

    return {
        setUser,
        getUser,
        clearUser,
    };
}

export default token();