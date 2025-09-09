import PropTypes from 'prop-types';

const SideMenu = ({ menu }) => {
	const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	return (
		<nav className="mainmenu-nav">
			<ul className="mainmenu list-group">
				{menu?.map((nav) => {
					const isExternal = nav.path.startsWith('http');
					const href = isExternal ? nav.path : `${BaseUrl}${nav.path}`;

					return (
						<li key={nav.id} className="nav-item">
							<a
								className="nav-link smoth-animation"
								href={href}
								{...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
							>
								{nav?.icon && <i className={nav.icon} />}
								{nav.text}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

SideMenu.propTypes = {
	menu: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			path: PropTypes.string.isRequired,
			text: PropTypes.string.isRequired,
			icon: PropTypes.string
		})
	).isRequired
};

export default SideMenu;
