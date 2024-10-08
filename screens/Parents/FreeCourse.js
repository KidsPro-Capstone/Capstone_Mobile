import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList, Pressable, Linking, Modal, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import open from '../../assets/Details/open2.png'
import lock from '../../assets/Details/padlock.png'
import back1 from '../../assets/welcome/back.png'
import { formatPrice } from '../../FormatPrice/Format';
import { WebView } from 'react-native-webview';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { isSmallPhone, isSmallTablet } from '../../Responsive/Responsive'
import { getCourse, getCourseById } from '../../Api/Course';
import game from '../../assets/Profile/control.png'
import Loading from '../../Loading/Loading'
import ErrorModal from '../../Alert/Alert';
import LongContent from '../../FormatPrice/FormatText';
import gameBtn from '../../assets/Game/game.jpg'
import drop from '../../assets/MyCourse/drop.png'
import lesson from '../../assets/Profile/book2.png'
import answer from '../../assets/Profile/reading.png'
import quizPic from '../../assets/Profile/quiz.png'
import close from '../../assets/welcome/close1.png'
import readBack from '../../assets/Quiz/stduy.jpg'
import HTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import freecourse from '../../assets/Lesson/kid2.jpg'
const FreeCourse = ({ route }) => {
    // usePreventScreenCapture();
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const { Id } = route.params;
    const { width: windowWidth } = useWindowDimensions();
    useEffect(() => {
        fetchClass()
    }, []);
    const [showLessons, setShowLessons] = useState({});
    const [showVideo, setShowVideo] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const render = ({ item, index }) => {
        const htmlContent = `
<p>Coding can help you earn more.
The average entry-level salary in the U.S. is $40,153 in 2022. But the average starting salary for a programmer is more than twice as much, at $85,293.</p>

<p>There's no denying the financial advantages of coding skills. The tech industry is known for its lucrative salary packages, and as someone who transitioned into this field, the financial uplift was a significant motivator.</p>

<p>We mentioned earlier that there are differences between coders and programmers. As you continue to learn about coding, you may start to specialize. Many of the highest coding salaries come from the ability to offer your skills in a specific type of coding.</p>

<p>For example, as you continue to code, you may become a developer. Besides writing code, developers also debug software and work with source code. Developers usually specialize in a specific programming language.</p>

<p>Developers often earn higher salaries than programmers and have high projected job growth. According to the U.S. Bureau of Labor Statistics, jobs for developers should grow by 22% by 2030.</p>
`;
        return (
            <View key={item.id}>
                <TouchableOpacity
                    onPress={() => {
                        setShowLessons(prevState => ({
                            ...prevState,
                            [item.id]: !prevState[item.id]
                        }));
                    }}
                    style={[styles.LessBorder, { alignItems: 'center', paddingVertical: hp('2%') }]}
                >
                    <Text style={{ color: '#8A8A8A', fontWeight: 'bold', fontSize: isSmallPhone || isSmallTablet ? wp('3.7%') : wp('4%'), marginLeft: wp('1.5%'), width: isSmallPhone || isSmallTablet ? wp('75%') : wp('80%'), textAlign: "left" }}>
                        Section {item.order} <Text>- {item.name} </Text>
                    </Text>
                    <Image source={drop} style={{ height: hp('3.5%'), width: wp('4.5%'), position: 'absolute', right: wp('4%'), paddingTop: hp('1%') }} />
                </TouchableOpacity>
                {showLessons[item.id] &&
                    <View>
                        {loading ? (
                            <Loading />
                        ) : (
                            <>
                                {item.lessons?.map((lesson, index) => (
                                    <TouchableOpacity key={lesson.id} style={styles.LessBorder}>
                                        <View style={styles.LessId}>
                                            <Text>{index + 1}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontWeight: '600', fontSize: wp('4%'), width: wp('70%') }}>{lesson.name}</Text>
                                            <Text style={{ color: '#8A8A8A', fontWeight: 'bold' }}>{lesson.duration}:00</Text>
                                        </View>
                                        {lesson.type === 'Video' ? (
                                            <TouchableOpacity onPress={() => setShowVideo(true)} style={{ position: 'absolute', right: wp('2%') }}>
                                                <Image style={{
                                                    width: wp('9%'),
                                                    height: hp('4.51%'),
                                                }} source={open} />
                                            </TouchableOpacity>
                                        ) : lesson.type === 'Document' ? (
                                            <TouchableOpacity style={{ position: 'absolute', right: wp('2%') }} onPress={toggleModal}>
                                                <Image style={{
                                                    width: wp('9%'),
                                                    height: hp('4.5%'),
                                                }} source={answer} />
                                            </TouchableOpacity>
                                        ) : (
                                            <Image style={{
                                                width: isSmallPhone || isSmallTablet ? wp('9.4%') : wp('9%'),
                                                height: hp('4.5%'),
                                                position: 'absolute', right: wp('2%')
                                            }} source={game} />
                                        )
                                        }
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Modal visible={isModalVisible} transparent={false} statusBarTranslucent={true} animationType='slide'>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                                                    <TouchableOpacity style={styles.closeDocument} onPress={closeDoc}>
                                                        <Image source={close} style={styles.buttonClose} />
                                                    </TouchableOpacity>
                                                    <View style={styles.Popup}>
                                                        <ImageBackground source={readBack} style={{ height: hp('70%'), borderRadius: 10, marginTop: 10 }}>
                                                            <View style={{ paddingLeft: wp('10%'), width: wp('84%'), marginTop: hp('2%') }}>
                                                                <ScrollView showsVerticalScrollIndicator={false} style={{ height: hp('55%'), marginTop: hp('2%') }}>
                                                                    <HTML
                                                                        source={{ html: htmlContent }}
                                                                        contentWidth={windowWidth}
                                                                        tagsStyles={{
                                                                            p: { fontSize: wp('4%') },
                                                                            h1: { fontSize: wp('5%') },
                                                                            h2: { fontSize: wp('5%') },
                                                                            h3: { fontSize: wp('5%') },
                                                                        }}
                                                                    />
                                                                    {/* <View style={{}}>
                                                                        <Text style={{ textAlign: 'left', width: wp('75%'), fontSize: wp('4.5%'), height: hp('60%'), paddingBottom: hp('2%') }}>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc</Text>
                                                                    </View> */}
                                                                </ScrollView>
                                                            </View>
                                                        </ImageBackground>
                                                    </View>
                                                </View>
                                            </Modal>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                                {item.quizzes?.map((quiz, index) => (
                                    <TouchableOpacity key={quiz.id} style={styles.LessBorder} >
                                        <View style={styles.LessId}>
                                            <Text>{item.lessons.length + index + 1}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontWeight: '600', fontSize: wp('4%'), width: wp('70%') }}>{quiz.title}</Text>
                                            <Text style={{ color: '#8A8A8A', fontWeight: 'bold' }}>{quiz.duration}:00</Text>
                                        </View>
                                        <Image style={{
                                            width: isSmallPhone || isSmallTablet ? wp('9.4%') : wp('9%'),
                                            height: hp('4.5%'),
                                            position: 'absolute', right: wp('2%')
                                        }} source={quizPic} />
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}
                    </View>
                }
            </View>
        );
    }
    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'blue', height: hp('1%'), borderTopLeftRadius: 10, borderTopRightRadius: 10 }} // Màu nền cho tab đang chọn
            style={{ backgroundColor: 'white' }} // Màu nền chung của tab bar
            labelStyle={{ color: 'black' }}// Màu chữ của tab
            tabStyle={{ color: 'red' }}
            renderLabel={({ route, focused, color }) => (
                <Text style={{ color: focused ? 'blue' : 'black' }}>{route.title}</Text>
            )}
        />
    );
    const navigation = useNavigation();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'about', title: 'About' },
        { key: 'lessons', title: 'Lessons' },
    ]);
    const [courseData, setCourseData] = useState([])
    const [section, setSection] = useState([])
    const fetchClass = async () => {
        try {
            const courseData = await getCourseById(Id);
            if (courseData && courseData.classes) {
                setCourseData(courseData)
                setSection(courseData.sections)
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const handlePress = () => {
        Linking.openURL('https://kidspro-capstone.github.io/Capstone-Game-WebGL/');
    };
    const VideoWebView = () => {
        return (
            <View style={{ height: 300, alignItems: 'center' }}>
                <WebView style={{ width: wp('100%') }}
                    allowsFullscreenVideo
                    source={{ uri: 'https://drive.google.com/file/d/1HbFzkqKh7_uaDdiDjAWBpvpJuT9tOaEC/preview' }}
                />
            </View>
        );
    };
    const closeModal = () => {
        setShowVideo(false);
    };
    const closeDoc = () => {
        setModalVisible(false);
    };
    const renderScene = SceneMap({
        about: () => (
            <View style={{
                paddingRight: wp('7%')
            }}>
                <ScrollView style={{ width: wp('100%'), marginBottom: hp('3%') }}>

                    <View>
                        <Text style={{ fontSize: wp('4%'), fontWeight: '500', marginTop: hp('1%') }}>About Course</Text>
                        <View style={{ paddingRight: wp('3%') }}>
                            <LongContent content={courseData.description} />
                        </View>
                    </View>
                </ScrollView>
            </View >
        ),
        lessons: () => (
            <View style={{ flex: 1 }}>
                {loading ? (
                    <Loading />
                ) : (
                    <View>
                        <Modal visible={showVideo} animationType="slide" transparent={true} statusBarTranslucent={true}>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                    <Image source={close} style={styles.buttonClose} />
                                </TouchableOpacity>
                                <VideoWebView />
                            </View>
                        </Modal>
                        <ScrollView showsVerticalScrollIndicator={false}
                        >
                            <View>
                                <FlatList
                                    data={section}
                                    renderItem={render}
                                    keyExtractor={item => item.id.toString()}
                                    numColumns={1}
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={false}
                                />
                                <TouchableOpacity onPress={handlePress} style={{ marginBottom: hp('3%') }}>
                                    <ImageBackground
                                        source={gameBtn}
                                        style={{
                                            borderWidth: 2,
                                            borderColor: 'white',
                                            borderRadius: 30,
                                            overflow: 'hidden',
                                            shadowColor: 'black',
                                            shadowOpacity: 0.9,
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowRadius: 20,
                                            elevation: 5,
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <View style={{
                                            height: hp('7%'),
                                            backgroundColor: 'rgba(200, 200, 200, 0.5)', justifyContent: 'center'
                                        }}>
                                            <Text style={{
                                                textAlign: 'center', color: 'blue'
                                                , fontWeight: 'bold', fontSize: isSmallPhone || isSmallTablet ? wp('3.75%') : wp('4%'), marginLeft: wp('5%'), width: wp('80%')
                                            }}>Game Programming</Text>
                                            <Image
                                                style={{
                                                    width: isSmallPhone || isSmallTablet ? wp('9.4%') : wp('9%'),
                                                    height: hp('4.5%'),
                                                    position: 'absolute',
                                                    right: wp('2%')
                                                }}
                                                source={game}
                                            />
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                )}
            </View>
        ),
    });
    const goBack = () => {
        navigation.goBack();
    };
    return (
        <View style={styles.Container}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Loading />
                </View>
            ) : (
                <ImageBackground source={freecourse} style={{ width: wp('100%'), height: hp('40%') }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: wp('6%'), paddingRight: wp('6%'), marginTop: hp('5%') }}>
                        <View style={{ borderRadius: 30, borderColor: 'white', backgroundColor: 'white', borderWidth: 1, width: wp('10%'), alignItems: 'center', height: hp('5%'), justifyContent: 'center' }}>
                            <TouchableOpacity onPress={goBack}>
                                <Image style={{ width: wp('5%'), height: hp('3%') }} source={back1} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.DetailForm}>
                        <TabView
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            initialLayout={{ width: '100%' }}
                            renderTabBar={renderTabBar}
                        />
                    </View>
                </ImageBackground>)}
        </View>
    )
}

export default FreeCourse

const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    DetailForm: {
        backgroundColor: 'white',
        position: 'absolute',
        top: hp('28%'), width: wp('100%'),
        height: hp('80%'),
        borderTopLeftRadius: 23,
        borderTopRightRadius: 23,
        paddingLeft: wp('5%'),
        paddingRight: wp('5%'),
    },
    Enroll: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0, width: wp('100%'),
        height: hp('10%'),
        borderTopLeftRadius: 23,
        borderTopRightRadius: 23,
        paddingLeft: wp('6.5%'),
        borderColor: '#e9f2eb',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    CircleMen: {
        width: wp('13.5%'),
        height: isSmallPhone || isSmallTablet ? hp('6.5%') : hp('6.75%'),
        borderRadius: 30,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFEFEF'
    },
    Circle: {
        width: wp('13.5%'),
        height: hp('6.5%'),
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#EFEFEF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        marginRight: wp('5%')
    },
    Button: {
        borderWidth: 1,
        height: hp('6%'),
        width: wp('45%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginTop: hp('1%'), backgroundColor: '#327CF7',
        borderColor: '#e9f2eb'
    },
    ButtonReview: {
        borderWidth: 1,
        height: hp('4%'),
        width: wp('22%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginTop: hp('1%'),
        borderColor: '#e9f2eb',
        marginRight: wp('1%')
    },
    LessBorder: {
        height: hp('7%'),
        flexDirection: 'row',
        borderRadius: 30,
        borderColor: '#e9f0f9',
        borderWidth: 1,
        paddingLeft: wp('2%'),
        alignItems: 'center',
        marginBottom: hp('2%'),
        shadowColor: 'black',
        shadowOpacity: 0.9,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 20,
        elevation: 5,
        backgroundColor: 'white',
        marginLeft: wp('0.5%'),
        marginRight: wp('0.5%'),
    },
    LessId: {
        borderRadius: 30,
        borderColor: '#e9f0f9',
        borderWidth: 1,
        justifyContent: 'center',
        width: wp('11%'),
        height: hp('5%'),
        alignItems: 'center',
        backgroundColor: '#e9f0f9',
        marginRight: wp('3%')
    },
    Search: {
        marginTop: hp('1%'),
        marginRight: wp('4%'),
        width: wp('90%'),
        height: hp('6.3%'),
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: wp('2.5%'),
        backgroundColor: '#F4F6F9'
    },
    SearchIcon: {
        width: wp('5.2%'),
        height: hp('2.5%'),
        marginRight: wp('3%'),
    },
    ButtonVideo: {
        borderColor: 'rgba(200, 200, 200, 0.8)',
        borderWidth: 1,
        width: wp('45%'),
        marginLeft: wp('25%'),
        marginTop: hp('3%'),
        borderRadius: 20,
        backgroundColor: 'rgba(200, 200, 200, 0.9)',
        paddingVertical: hp('1%'),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingTop: 10
    },
    buttonClose: {
        width: wp('4%'),
        height: hp('2%'),
    },
    NameKid: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        width: wp('42.5%'),
        borderRadius: 10,
        height: hp('8%'),
        borderColor: '#E9E9E9',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.9,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 20,
        elevation: 5,
        backgroundColor: 'white',
        marginLeft: wp('1%'),
        marginBottom: hp('2%'),
    },
    Popup: {
        backgroundColor: 'white',
        width: wp('90%'),
        height: isSmallPhone || isSmallTablet ? hp('80%') : hp('72%'),
        borderRadius: 10,
    },
    closeButton: {
        position: 'absolute',
        top: hp('20%'),
        right: wp('2%')
    },
    closeDocument: {
        position: 'absolute',
        top: hp('10%'),
        right: wp('5%')
    },
    ClassInfo: {
        fontSize: isSmallPhone || isSmallTablet ? wp('4.5%') : wp('5.5%'),
        fontWeight: '500',
        color: '#327CF7',
        textAlign: 'left',
        lineHeight: hp('5.5%'),
        borderWidth: 1.5,
        width: wp('83%'),
        marginBottom: hp('2%'),
        borderRadius: 10,
        paddingLeft: wp('2%'),
        marginLeft: wp('1%'),
        marginBottom: hp('2%'),
        borderColor: 'lightblue',
        paddingVertical: hp('1%'),
        shadowColor: 'black',
        shadowOpacity: 0.9,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 20,
        elevation: 5,
        backgroundColor: 'white',
    }
})