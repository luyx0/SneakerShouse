import './App.scss';

import Header from "./components/Header/Header";
import Drawer from "./components/Drawer/Drawer";

import {useContext, useEffect, useState} from "react";

import axios from "axios";
import Home from "./pages/Home/Home";
import {Route, Routes} from "react-router-dom";
import Favourites from "./pages/Favourites/Favourites";
import AppContext from "./context";
import Orders from "./pages/Orders/Orders";
import useWindowDimensions from "./hooks/useWindowDimensions";

import Auth from "./pages/Login/Auth";
import Admin from "./pages/Login/Admin";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {check} from "./http/userAPI";


const App = observer(() => {

    const {user} = useContext(Context)

    const [sneakers, setSneakers] = useState([]);
    const [cartSneakers, setCartSneakers] = useState([]);
    const [isCartOpened, setIsCartOpened] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [favouriteSneakers, setFavouriteSneakers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { height, width } = useWindowDimensions();



    useEffect(() => {


        check().then(data =>{
            user.setUser(true)
            user.setIsAuth(true)
        }).finally(() => setLoading(false))

        const fetchData = async () => {
            try {
                setLoading(true)
                const resSnk = await axios.get("https://631cefe6789612cd07a3ec55.mockapi.io/items");
                const resCart = await axios.get("https://631cefe6789612cd07a3ec55.mockapi.io/cart");
                const resFav = await axios.get("https://631cefe6789612cd07a3ec55.mockapi.io/favorites");
                setLoading(false)

                setCartSneakers(resCart.data);
                setFavouriteSneakers(resFav.data)
                setSneakers(resSnk.data);
            } catch (e) {
                alert("Error");
                console.log(e);
            }


        }
        fetchData();

    }, [])


    const onClickCartAdd = async (obj) => {
        try {
            const findItem = cartSneakers.find(e => e.parentId === obj.id);
            if (findItem) {
                axios.delete(`https://631cefe6789612cd07a3ec55.mockapi.io/cart/${findItem.id}`);
                setCartSneakers(prev => prev.filter(s => +s.parentId !== +obj.id))
            } else {
                setCartSneakers(prev => [...prev, obj])
                let {data} = await axios.post("https://631cefe6789612cd07a3ec55.mockapi.io/cart", obj);
                setCartSneakers(prev => prev.map(el => {
                    if (el.parentId === data.parentId) {
                        return {
                            ...el,
                            id: data.id
                        }
                    }
                    return el;
                }))
            }
        } catch (e) {
            alert("Error cart");
            console.log(e);
        }


    }

    const onClickFavRemove = (obj) => {
        axios.delete(`https://631cefe6789612cd07a3ec55.mockapi.io/favorites/${obj.id}`);
        setFavouriteSneakers(prev => prev.filter(s => +s.id !== +obj.id))
    }

    const onClickCartRemove = (obj) => {
        axios.delete(`https://631cefe6789612cd07a3ec55.mockapi.io/cart/${obj.id}`);
        setCartSneakers(prev => prev.filter(s => +s.id !== +obj.id))
    }

    const onAddFavourite = async (obj) => {
        try {
            const findItem = favouriteSneakers.find(e => +e.parentId === +obj.id);

            if (findItem) {
                axios.delete(`https://631cefe6789612cd07a3ec55.mockapi.io/favorites/${findItem.id}`);
                setFavouriteSneakers(prev => prev.filter(s => +s.parentId !== +obj.id))
            } else {
                let {data} = await axios.post("https://631cefe6789612cd07a3ec55.mockapi.io/favorites", obj);
                setFavouriteSneakers(prev => [...prev, data]);

            }
        } catch (e) {
            alert("Error favourites");
            console.log(e);
        }


    }

    const isItemCartAdded = (id) => {
        return cartSneakers.some(s => Number(s.parentId) === Number(id))
    }
    const isItemFavAdded = (id) => {
        return favouriteSneakers.some(s => Number(s.parentId) === Number(id));
    }


    return (


        <AppContext.Provider value={{
            favouriteSneakers,
            isItemCartAdded,
            isItemFavAdded,
            setIsCartOpened,
            cartSneakers,
            setCartSneakers,
            onClickFavRemove,
            setLoading,
            loading,
            height, width
        }}>

            <div className="wrapper">
                {<Drawer onClickCloseCart={() => setIsCartOpened(false)}
                         cartSneakers={cartSneakers}
                         onClickCartRemove={onClickCartRemove}
                         isCartOpened={isCartOpened}
                />}




                <Header onClickCart={() => setIsCartOpened(true)}/>

                <Routes>

                    <Route path="/" element={<Home searchValue={searchValue}
                                                   setSearchValue={setSearchValue}
                                                   onClickCartAdd={onClickCartAdd}
                                                   sneakers={sneakers}
                                                   onAddFavourite={onAddFavourite}
                                                   cartSneakers={cartSneakers}
                                                   loading={loading}
                                                   isItemFavAdded={isItemFavAdded}
                                                   width={width}
                    />}/>

                    <Route path="/favourites" exact
                           element={<Favourites
                               onClickCartAdd={onClickCartAdd}
                               onAddFavourite={onAddFavourite}
                           />}/>

                    <Route path="/orders" exact
                           element={<Orders/>}/>

                    <Route path="/login" exact
                           element={<Auth/>}/>

                    <Route path="/registration" exact
                           element={<Auth/>}/>

                    <Route path="/admin" exact
                           element={<Admin/>}/>



                </Routes>

            </div>
        </AppContext.Provider>
    );
});

export default App;
