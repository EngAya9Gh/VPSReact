import SEO from "@components/seo";
import Wrapper from "@layout/wrapper"; 
import Header from "@layout/header/header-02";
import Footer from "@layout/footer/footer-02";
import TopBarArea from "@containers/top-bar";
import ActivityArea from "@containers/activity-security"; // تأكد من صحة المسار

export async function getStaticProps() {
   
    return {
        props: {
           
            className: "home-sticky-pin sidebar-header position-relative",
        },
    };
}

const Home = ({ myItems, className }) => {
  
    return (
        <Wrapper>
            <SEO pageTitle="Activity" />
            <Header />
            <div className="list-item-1">
                <TopBarArea />
            </div>
            <main id="main-content">
                <ActivityArea  />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Home;
