import Sticky from '@ui/sticky';
import TabContent from 'react-bootstrap/TabContent';
import TabContainer from 'react-bootstrap/TabContainer';
import TabPane from 'react-bootstrap/TabPane';
import Nav from 'react-bootstrap/Nav';
import PropTypes from 'prop-types';
import PersonalInformation from './personal-information';

const EditProfile = ({ authUser, token }) => {
    let link = null;
    let displayedText = null;
    let link_wakil = null;
    let displayedText_wakil = null;
    let link_agent = null;
    let displayedText_agent = null;

    if (authUser.role === 1) {
        link_wakil = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_A`;
        displayedText_wakil = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_A`;

        link_agent = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_B`;
        displayedText_agent = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_B`;

        link = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_C`;
        displayedText = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_C`;
    } else if (authUser.role === 2) {
        link_agent = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_B`;
        displayedText_agent = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_B`;

        link = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_C`;
        displayedText = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_C`;
    } else if (authUser.role === 3) {
        link = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_C`;
        displayedText = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/join/${authUser.name}_C`;
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            // يمكنك استخدام مكتبة مثل `react-toastify` هنا لعرض تنبيه بشكل أفضل
            console.log("تم نسخ الرابط!");
        }).catch((error) => {
            console.error("فشل في النسخ: ", error);
        });
    };

    return (
        <div className="edit-profile-area rn-section-gapTop">
            <div className="container">
                <div className="row plr--70 padding-control-edit-wrapper pl_md--0 pr_md--0 pl_sm--0 pr_sm--0">
                    <div className="col-12 d-flex justify-content-between mb--30 align-items-center">
                        <h4 className="title-left">
                            رابطة الدعوة:
                            {link && (
                                <div>
                                    <span>الرابط للزبائن: </span>
                                    <a href={link}>{displayedText}</a>
                                    <button 
                                        type="button" 
                                        onClick={() => copyToClipboard(link)} 
                                        className="copy-btn">
                                        نسخ
                                    </button>
                                </div>
                            )}
                            {link_agent && (
                                <div>
                                  
                                  <span>رابط تسجيل صاحب محل  : </span>

                                    <a href={link_agent}>{displayedText_agent}</a>
                                    <button 
                                        type="button" 
                                        onClick={() => copyToClipboard(link_agent)} 
                                        className="copy-btn">
                                        نسخ
                                    </button>
                                </div>
                            )}
                            {link_wakil && (
                                <div>
                                        <span>الرابط تسجيل الوكيل: </span>

                                    <a href={link_wakil}>{displayedText_wakil}</a>
                                    <button 
                                        type="button" 
                                        onClick={() => copyToClipboard(link_wakil)} 
                                        className="copy-btn">
                                        نسخ
                                    </button>
                                </div>
                            )}
                        </h4>
                    </div>
                </div>
                <TabContainer defaultActiveKey="nav-home">
                    <div className="row plr--70 padding-control-edit-wrapper pl_md--0 pr_md--0 pl_sm--0 pr_sm--0">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <Sticky>
                                <nav className="left-nav rbt-sticky-top-adjust-five">
                                    <Nav className="nav nav-tabs">
                                        <Nav.Link eventKey="nav-home" as="button">
                                            <i className="feather-user" />
                                            المعلومات الشخصية
                                        </Nav.Link>
                                    </Nav>
                                </nav>
                            </Sticky>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 mt_sm--30">
                            <TabContent className="tab-content-edit-wrapepr">
                                <TabPane eventKey="nav-home">
                                    <PersonalInformation
                                        authUser={authUser}
                                        token={token}
                                    />
                                </TabPane>
                            </TabContent>
                        </div>
                    </div>
                </TabContainer>
            </div>
        </div>
    );
};

EditProfile.propTypes = {
    authUser: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired
};

export default EditProfile;
