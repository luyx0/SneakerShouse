import React, {useContext} from 'react';
import 'macro-css';
import logo from "../../assets/logo.png";
import cart from "../../assets/cart.svg";
import fav from "../../assets/favourites.svg";
import consumer from "../../assets/user.svg";

import s from "./Header.module.scss";
import {Link, NavLink} from "react-router-dom";
import AppContext from "../../context";
import {Context} from "../../index";
import {HOME_ROUTE, LOGIN_ROUTE} from "../../utils/consts";

import {Button, Nav} from "react-bootstrap";
import {observer} from "mobx-react-lite";

const Header = observer(({onClickCart}) => {

    const {cartSneakers} = useContext(AppContext);
    const {user} = useContext(Context);


    return (
        <header>
            <NavLink to={HOME_ROUTE}>
                <div className={s.leftSide}>
                    <img src={logo} alt="logo" width="50" height="50"/>
                    <h3>SneakerShouse</h3>
                </div>
            </NavLink>
            <div className={s.rightSide}>
                {user.isAuth ?
                    <Nav className="" style={{color: 'white'}}>
                        <Button variant={"outline-light"}>
                            Admin
                        </Button>
                        <Button variant={"outline-light"} className="ml-4">
                            Exit
                        </Button>
                    </Nav>
                    :
                    <Nav style={{color: 'white'}}>
                        <NavLink to={LOGIN_ROUTE}>
                            <Button variant={"outline-light"} onClick={() => user.setIsAuth(true)}>
                                Sign in
                            </Button>
                        </NavLink>

                    </Nav>
                }
                <div className={s.cart} onClick={onClickCart}>
                    <img src={cart} alt="cart"/>
                    <span>${
                        cartSneakers.reduce((res, item) => res + item.price, 0)
                    }</span>
                </div>
                <NavLink to="/favourites">
                    <div className={s.favourites}>
                        <img src={fav} alt="fav"/>
                    </div>
                </NavLink>

                <NavLink to={"/orders"}>
                    <div className={s.user}>
                        <img src={consumer} alt="user"/>
                    </div>
                </NavLink>

            </div>
        </header>
    );
});

export default Header;