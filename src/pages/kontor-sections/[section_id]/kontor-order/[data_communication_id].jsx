import PropTypes from 'prop-types';
import clsx from 'clsx';
import ProductTitle from '@components/product-details/myFavorite';
import { getData } from '@utils/getData';
import { useEffect } from 'react';
import OrderForm from '@components/order-form/kontor';
import withAuth from '@components/auth/withAuth';

export async function getServerSideProps(context) {
       const { data_communication_id, mobile } = context.query; // استخراج data_communication_id و mobile من الـ query

    // طباعة الموبايل في الكونسول
   

    // الحصول على البيانات بناءً على serviceId
    const data = await getData(`kontor/${data_communication_id}`);

    return {
        props: {
            ...data,
            mobile: mobile || null // إذا كان mobile موجودًا، يتم تمريره، وإذا لم يكن موجودًا يتم تمرير null
        }
    };
}

const ProductDetailsArea = ({ myItems, mobile }) => {
useEffect(() => {
		
 console.log('Mobile:', mobile);

	
	}, []);


    return (
        <div className={clsx('product-details-area')}>
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-12 col-md-12 col-sm-12 mt_md--50 mt_sm--60">
                        <div className="rn-pd-content-area product-style-one mydiv">
                            <ProductTitle
                                title={myItems?.dataCommunication?.name}
                                item_id={myItems.dataCommunication.id}
                                item_type="DataCommunication"
                            />
                            <span className="bid">
                                <span className="price" />
                            </span>
                            {myItems?.dataCommunication && (
                                <OrderForm
                                    app={myItems.dataCommunication}
                                    myMobile={mobile} // تمرير mobile إلى OrderForm
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductDetailsArea.propTypes = {
    myItems: PropTypes.shape({
        dataCommunication: PropTypes.shape({
            name: PropTypes.string.isRequired,
            likeCount: PropTypes.number
        }).isRequired
    }).isRequired,
    mobile: PropTypes.string // إضافة PropType لرقم الموبايل
};

export default withAuth(ProductDetailsArea);
