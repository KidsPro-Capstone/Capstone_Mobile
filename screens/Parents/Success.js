import { Image, StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { AppState } from 'react-native';
import success1 from '../../assets/Payment/Success.png'
import tag from '../../assets/Lesson/tag.png'
import close from '../../assets/welcome/close1.png'
import wait from '../../assets/Payment/pend1.png'
import Loading from '../../Loading/Loading'
import { getOrderDetail } from '../../Api/Order';
import { isSmallPhone, isSmallTablet } from '../../Responsive/Responsive'
import { useFocusEffect } from '@react-navigation/native';
import { formatPrice } from '../../FormatPrice/Format';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const Success = ({ navigation, route }) => {
    const { success, classInfo } = route.params;
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const [aState, setAppState] = useState(AppState.currentState);
    useEffect(() => {
        const appStateListener = AppState.addEventListener(
            'change',
            nextAppState => {
                setAppState(nextAppState);
                if (nextAppState === 'active') {
                    fetchOrderDetail();
                }
            },
        );
        return () => {
            appStateListener?.remove();
        };
    }, []);
    const [data, setData] = useState([])
    const fetchOrderDetail = async () => {
        try {
            setLoading1(true);
            const orderDetail = await getOrderDetail(success);
            if (orderDetail) {
                setData(orderDetail);
                console.log("test succ:", orderDetail);
            }
        } catch (error) {
        } finally {
            setLoading1(false);
        }
    };
    return (
        <View style={styles.Container}>
            {loading1 ? (
                <View style={{ alignItems: 'center', justifyContent: "center", flex: 1 }}>
                    <Loading />
                </View>
            ) : (
                <View>
                    <View style={{ alignItems: 'center', marginTop: hp('10%') }}>
                        {data && data.status === 'Pending' ? (
                            <View style={{ alignItems: 'center' }}>
                                <Image style={styles.Icon} source={success1} />
                                <Text style={{ color: '#FF8A00', fontWeight: '600', fontSize: wp('6.5%'), marginBottom: hp('1%') }}>Thanks you purchased</Text>
                            </View>
                        ) : data && data.status === 'Process' ? (
                            <View style={{ alignItems: 'center' }}>
                                <Image style={styles.Icon} source={wait} />
                                <Text style={{ color: '#FF8A00', fontWeight: '600', fontSize: wp('6.5%'), marginBottom: hp('1%') }}>Your Order Not Payment!</Text>
                            </View>
                        ) : null}
                    </View>

                    <View>
                        <Text style={{ textAlign: 'center', fontSize: wp('5%'), marginBottom: hp('1%'), fontWeight: '500' }}>{formatPrice(data.totalPrice)}</Text>
                        {/* <Text style={{ textAlign: 'center', fontSize: wp('5%'), marginBottom: hp('1%'), fontWeight: '500' }}>{(Price * (selectedStudents.length)).toLocaleString('vi-VN')} đ</Text> */}
                        <Text style={{ fontSize: wp('5%'), textAlign: 'center' }}>Your order code: {data.orderCode}</Text>
                    </View>
                    <View style={styles.Course}>
                        <Image source={{ uri: data.pictureUrl }} style={styles.CourseImage} />
                        <View>
                            <View style={{ flexDirection: 'row', borderColor: "white", borderWidth: 1, paddingVertical: wp('1%'), borderRadius: 10, backgroundColor: '#EFEFEF', width: wp('45%') }}>
                                <Text style={{ color: 'orange', fontWeight: '500', fontSize: wp('3.8%'), marginLeft: wp('1.5%') }}>ClassCode : </Text>
                                <Text style={{ color: 'orange', fontWeight: '500', fontSize: wp('3.8%') }}>{data.classCode}</Text>
                            </View>
                            <Text style={{ marginLeft: wp('1.5%'), fontSize: wp('3.5%'), fontWeight: '500', width: wp('50%') }}>{data.courseName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp('0.5%') }}>
                                {/* <Image source={teacher} style={{ width: wp('5%'), height: hp('3%'), marginRight: wp('2.5%'), marginLeft: wp('1%') }} /> */}
                                {/* <Text style={{
                                    fontWeight: 'bold',
                                    color: '#40BFFF',
                                    fontSize: wp('3.8%')
                                }}>{classInfo.teacher}</Text> */}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp('0.5%') }}>
                                <Image source={tag} style={{ width: wp('5%'), height: hp('3%'), marginRight: wp('2.5%'), marginLeft: wp('1%') }} />
                                <Text style={{
                                    fontWeight: 'bold',
                                    color: 'blue',
                                    fontSize: wp('3.8%')
                                }}>
                                    {formatPrice(data.price)}
                                    {/* {parseFloat(Price.replace(/\./g, '').replace(',', '.')).toLocaleString('vi-VN')} đ */}
                                </Text>
                            </View>

                        </View>
                    </View>
                    <View style={{ height: hp('0.3%'), width: wp('90%'), backgroundColor: '#E9E9E9' }} />
                    <View style={styles.Order}>
                        <Text style={{ fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.7%') : wp('4.3%') }}>For more details about your order</Text>
                        <TouchableOpacity style={styles.Btn1} onPress={toggleModal}>
                            <Text style={{ fontWeight: '400', fontSize: wp('3.7%'), color: 'blue' }}>View Order</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            )}
            <View style={styles.Enroll}>
                <TouchableOpacity style={styles.Button} onPress={() => { navigation.navigate('HomePage') }}>
                    <Text style={{ color: 'white', fontWeight: '500', fontSize: wp('4.5%') }}>Back to HomePage</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Modal visible={isModalVisible} transparent={true} statusBarTranslucent={true}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                            <Image source={close} style={styles.buttonClose} />
                        </TouchableOpacity>
                        <View style={styles.Popup}>
                            <ScrollView showsVerticalScrollIndicator={true}>
                                <View style={{ paddingRight: wp('3%') }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%') }}>
                                        <Text style={{ lineHeight: hp('4%'), color: '#40BFFF', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>Children Receive <Text style={{ color: 'red', fontWeight: '500' }}>({data.quantityPurchased})</Text></Text>
                                        <View>
                                            {data && data.students && data.students.map((student, index) => (
                                                <Text
                                                    key={index}
                                                    style={{ lineHeight: hp('4%'), color: 'black', fontWeight: '500', textAlign: 'right', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}
                                                >
                                                    {student.studentName}
                                                </Text>
                                            ))}
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%') }}>
                                        <Text style={{ lineHeight: hp('4%'), color: '#40BFFF', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>Class Code</Text>
                                        <Text style={{ lineHeight: hp('4%'), color: 'black', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>{data.classCode}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%') }}>
                                        <Text style={{ lineHeight: hp('4%'), color: '#40BFFF', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>Receive Method</Text>
                                        <Text style={{ lineHeight: hp('4%'), color: 'black', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>Email</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%') }}>
                                        <Text style={{ lineHeight: hp('4%'), color: '#40BFFF', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>Status Order</Text>
                                        <Text style={{ lineHeight: hp('4%'), color: 'black', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>{data.status}</Text>
                                    </View>
                                </View>
                                <View style={{ width: wp('83%'), height: hp('0.2%'), backgroundColor: '#E9E9E9', marginTop: hp('2%') }} />

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%'), paddingRight: wp('3%') }}>
                                    <View>
                                        <Text style={{ lineHeight: hp('4%'), color: '#40BFFF', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>Payment Method</Text>
                                        <Text style={{ lineHeight: hp('4%'), color: '#40BFFF', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>Amount</Text>
                                        <Text style={{ lineHeight: hp('4%'), color: '#40BFFF', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>Quantity</Text>
                                        <Text style={{ lineHeight: hp('4%'), color: '#40BFFF', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>Voucher</Text>
                                    </View>
                                    <View>
                                        <Text style={{ lineHeight: hp('4%'), color: 'black', fontWeight: '500', textAlign: 'right', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>{data.paymentType}</Text>
                                        <Text style={{ lineHeight: hp('4%'), color: 'black', fontWeight: '500', textAlign: 'right', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>{formatPrice(data.price * (data.quantityPurchased))}</Text>
                                        <Text style={{ lineHeight: hp('4%'), color: 'black', fontWeight: '500', textAlign: 'right', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>x {data.quantityPurchased}</Text>
                                        <Text style={{ lineHeight: hp('4%'), color: 'red', fontWeight: '700', textAlign: 'right', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>- {data && data.discount ? formatPrice(data.discount) : '0đ'}</Text>
                                        {/* <Text style={{ lineHeight: hp('4%'), color: 'black', fontWeight: '500', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>{(Price * (selectedStudents.length)).toLocaleString('vi-VN')} đ</Text> */}
                                    </View>
                                </View>
                                <View style={{ width: wp('83%'), height: hp('0.2%'), backgroundColor: '#E9E9E9', marginTop: hp('2%') }} />

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%'), paddingRight: wp('3%') }}>
                                    <View>
                                        <Text style={{ lineHeight: hp('4%'), color: 'red', fontWeight: '700', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>Total</Text>
                                    </View>
                                    <View>
                                        <Text style={{ lineHeight: hp('4%'), color: 'red', fontWeight: '700', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>{formatPrice(data.totalPrice)}</Text>

                                        {/* <Text style={{ lineHeight: hp('4%'), color: 'red', fontWeight: '700', fontSize: isSmallPhone || isSmallTablet ? wp('3.8%') : wp('4.3%') }}>{(Price * (selectedStudents.length)).toLocaleString('vi-VN')} đ</Text> */}
                                    </View>
                                </View>
                                <View style={{ width: wp('83%'), height: hp('0.2%'), backgroundColor: '#E9E9E9', marginTop: hp('2%') }} />
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

export default Success

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: wp('5%'),
        paddingRight: wp('5%'),
        justifyContent: 'center'
    },
    Icon: {
        width: isSmallPhone || isSmallTablet ? wp('31%') : wp('30%'),
        height: hp('15%'),
        marginBottom: hp('5%')
    },
    Course: {
        flexDirection: 'row',
        marginTop: hp('1.5%'),
        borderWidth: 2,
        width: wp('90%'),
        paddingHorizontal: hp('1%'),
        paddingVertical: wp('2%'),
        borderRadius: 10,
        borderColor: '#E9E9E9',
        alignItems: 'center',
        marginBottom: hp('2%'),
        shadowColor: 'black',
        shadowOpacity: 0.9,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 20,
        elevation: 5,
        backgroundColor: 'white'
    },
    CourseImage: {
        width: wp('30%'),
        height: hp('15%'),
        borderRadius: 10,
        marginRight: wp('3%')
    },
    Name: {
        width: wp('50%'),
        fontWeight: 'bold',
        color: '#223263',
        fontSize: wp('3.7%')
    },
    Order: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('1.5%'),
        alignItems: 'center'
    },
    Btn1: {
        borderWidth: 0.7,
        borderColor: "blue",
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 5,
        shadowColor: 'black',
        shadowOpacity: 0.9,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 20,
        elevation: 5,
        backgroundColor: 'white'
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
    Button: {
        borderWidth: 1,
        height: hp('7%'),
        width: wp('90%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginTop: hp('1%'), backgroundColor: '#327CF7',
        borderColor: '#e9f2eb'
    },
    Popup: {
        backgroundColor: 'white',
        width: wp('90%'),
        height: isSmallPhone || isSmallTablet ? hp('50%') : hp('60%'),
        borderRadius: 10,
        justifyContent: 'center',
        paddingLeft: wp('3%'),
    },
    Btn: {
        backgroundColor: '#40BFFF',
        height: hp('7%'),
        width: wp('40%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    buttonClose: {
        width: wp('4%'),
        height: hp('2%'),
    },
    closeButton: {
        position: 'absolute',
        top: hp('20%'),
        right: wp('2%')
    }
})