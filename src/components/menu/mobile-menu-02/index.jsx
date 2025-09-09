import PropTypes from 'prop-types';
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from '@ui/offcanvas';
import Tools from '@components/sign-in-tools';
import Logo from '@components/logo';
import { Link } from 'react-scroll';
import { useState, useEffect } from 'react';

const MobileMenu = ({ isOpen, onClick, menu, logo,auth,debts ,isAuthenticated}) => {
  const [currency, setCurrency] = useState('TL');

        useEffect(() => {
          if (typeof window !== 'undefined') {
            const savedCurrency = localStorage.getItem('currency') || 'TL';
            setCurrency(savedCurrency.toUpperCase());
          }
        }, []);



return (
	<Offcanvas isOpen={isOpen} onClick={onClick}>
		<OffcanvasHeader onClick={onClick}>
			<Logo logo={logo}
                  />
		</OffcanvasHeader>
      <>
         	{isAuthenticated ? (
              <>
              <p className="name-style ">{auth.name}</p>
              <p className="price align-txt-center">{auth.balance}<span className="debts">( {debts} ){currency} </span></p>
		      <Tools/>	
               </>	) : null}
      </>
		<OffcanvasBody>
			<nav>
				<ul className="mainmenu">
					{menu?.map((nav) => (
						<li id={nav.id} key={nav.id}>
							<a
								href={`${nav.path}`}
                               className='basecolor'
							>
								{nav.text}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</OffcanvasBody>
	</Offcanvas>
)};

MobileMenu.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
	menu: PropTypes.arrayOf(PropTypes.shape({})),
	logo: PropTypes.arrayOf(
		PropTypes.shape({
			src: PropTypes.string.isRequired,
			alt: PropTypes.string
		})
	)
};

export default MobileMenu;
