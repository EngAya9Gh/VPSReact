import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-02";
import Footer from "@layout/footer/footer-02";
import Breadcrumb from "@components/breadcrumb";
import ConnectArea from "@containers/connect";
import TopBarArea from '@containers/top-bar';

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Connect = () => (
    <Wrapper>
        <SEO pageTitle="Connect" />
        <Header />
        <main id="main-content">
        <div className="list-item-1">
					<TopBarArea />
				</div>
            <Breadcrumb
                pageTitle="Make your payment easier"
                currentPage="Make your payment easier"
            />
            <ConnectArea />
        </main>
        <Footer /> 
    </Wrapper>
);

export default Connect;
