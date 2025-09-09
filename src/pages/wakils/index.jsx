import SEO from "@components/seo";
import Wrapper from "@layout/wrapper"; 
import Header from "@layout/header/header-02";
import Footer from "@layout/footer/footer-02";
import TopBarArea from "@containers/top-bar";
import React, { useEffect, useState } from "react";
import { getData } from "@utils/getData";
import ActivityArea from "@containers/activity-wakil"; // تأكد من صحة المسار

export async function getStaticProps() {
    const data = await getData("programs");
    return {
        props: {
            myItems: data || [], // تمرير البيانات باسم myItems
            className: "home-sticky-pin sidebar-header position-relative",
        },
    };
}

const Home = ({ myItems, className }) => {
    const [services, setServicesField] = useState([]);

    useEffect(() => {
        console.log("Fetched services:", myItems);
        setServicesField(myItems);
    }, [myItems]);

    return (
        <Wrapper>
            <SEO pageTitle="وكلاؤنا" />
            <Header />
            <div className="list-item-1">
                <TopBarArea />
            </div>
            <main id="main-content">
                <ActivityArea data={ myItems } />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Home;
