import { useEffect,useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import clsx from 'clsx';
import Anchor from '@ui/anchor';
import myStaticServices from '../../../data/my-static-services.json';


const Product = ({ overlay, title, slug, image ,section_id,id}) => {
  
	const [path, setPath] = useState([]);
const foundItem = myStaticServices.find((item) => item.slug === slug);
const hasSection = foundItem ? foundItem.hasSections : null;
useEffect(() => {
  
  let path = '';
  if (hasSection) {
    path = `/${slug}-sections/${section_id}/${slug}-order/${id}`;
  } else {
    path = `/${slug}-order/${id}`;
  }
	console.log(path);
  setPath(path);
}, []);

  return(
	<div
		className={clsx(
			'companyCard product-style-one',
			!overlay && 'no-overlay'
		)}
	>
		<div className="card-thumbnail">
			<Anchor path={path}>
				<Image src={image} alt={title} width={533} height={533} />
			</Anchor>
		</div>
	</div>
); 
};

Product.propTypes = {
	overlay: PropTypes.bool,
	title: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
	image: PropTypes.string
};

Product.defaultProps = {
	overlay: false
};

export default Product;
