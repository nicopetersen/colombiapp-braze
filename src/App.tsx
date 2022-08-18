import { EyeFilled, EyeOutlined, GoogleOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    PageHeader,
    Select,
    Spin,
    Statistic,
    Table,
    Typography,
} from "antd";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Clock } from "./components/Clock";
import { Gallery } from "./components/Gallery";
import { Map } from "./components/Map";
import { UserContext } from "./contexts/UserContext";
import { auth, db } from "./services/firebase";
import * as braze from "@braze/web-sdk";
import { link } from "fs/promises";
import { Navigate, useNavigate } from "react-router-dom";

braze.initialize("d3549196-70d5-4c23-8879-477edc26129c", {
    baseUrl: "sdk.iad-06.braze.com",
    enableLogging: true
});
braze.openSession()
braze.automaticallyShowInAppMessages();
braze.logCustomEvent("Testeo")


function App() {
    const { user, setUser } = useContext(UserContext);
    const [registerPayment, setRegisterPayment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showData, setShowData] = useState(false);
    const [usd, setUsd] = useState(200);
    const [test, setTest] = useState(100);
  

    useEffect(() => {
        fetch(`https://api.bluelytics.com.ar/v2/latest`)
            .then((res) => res.json())
            .then((data) => setUsd(data.blue.value_avg));
    }, []);

    return (
        <div className="pb-48">
            <PageHeader
                avatar={{
                    src: user?.photoURL,
                }}
                className="shadow-md"
                onBack={undefined}
                title="Colombia 2023 🇨🇴"
            />
            <Typography.Title level={3} className="m-4 mb-0">
                Faltan sólo...
            </Typography.Title>
            <Button
                onClick={() => {
                    setTest(test + 100)
                    console.log(test)
                }}
                type="primary"
                className="bg-primary-color border-primary-color text-black p-4 w-full mr-1 flex items-center justify-center rounded-md"
            >Tester click</Button>
            <Clock />

            <Map />
            <div className="p-4">
                <Typography.Title level={3}>Mis pagos</Typography.Title>
                {user ? (
                    <div className="flex items-center">
                        <Button
                            onClick={() => {
                                setRegisterPayment(true);
                            }}
                            type="primary"
                            className="bg-primary-color border-primary-color text-black p-4 w-full mr-1 flex items-center justify-center rounded-md"
                        >
                            Registar un pago
                        </Button>
                        <Button
                            loading={loading}
                            onClick={async () => {
                                const q = query(
                                    collection(db, "pagos"),
                                    where("uid", "==", user.uid),
                                    where("deleted", "!=", true)
                                );

                                const querySnapshot = await getDocs(q);
                                // querySnapshot.forEach((doc) => {
                                //     // doc.data() is never undefined for query doc snapshots
                                //     console.log(doc.id, " => ", doc.data());
                                // });
                                const pagos = querySnapshot.docs.map((doc) =>
                                    doc.data()
                                );
                                Modal.info({
                                    title: "Mis pagos",
                                    icon: null,
                                    bodyStyle: { padding: "10px" },
                                    // className: "p-0",
                                    content: (
                                        <div>
                                            <Table
                                                dataSource={pagos}
                                                pagination={false}
                                                showHeader={false}
                                            >
                                                <Table.Column
                                                    title=""
                                                    render={(
                                                        value,
                                                        pago: any
                                                    ) => (
                                                        <Avatar
                                                            src={pago.photoURL}
                                                        />
                                                    )}
                                                />
                                                <Table.Column
                                                    title="Fecha"
                                                    render={(
                                                        value,
                                                        pago: any
                                                    ) => {
                                                        return moment(
                                                            pago.fecha.seconds *
                                                            1000
                                                        ).format("DD/MM/yyyy");
                                                    }}
                                                />
                                                {/* <Table.Column
                                                    title="Nombre"
                                                    render={(
                                                        value,
                                                        pago: any
                                                    ) => pago.nombre}
                                                /> */}
                                                <Table.Column
                                                    title="Monto"
                                                    render={(
                                                        value,
                                                        pago: any
                                                    ) =>
                                                        `ARS $${pago.monto.toLocaleString()}`
                                                    }
                                                />
                                                <Table.Column
                                                    title="Medio"
                                                    render={(
                                                        value,
                                                        pago: any
                                                    ) => pago.medio}
                                                />
                                            </Table>
                                        </div>
                                    ),
                                });
                            }}
                            type="ghost"
                            className="p-4 w-full ml-1 flex items-center justify-center rounded-md"
                        >
                            Ver mis pagos
                        </Button>
                    </div>
                ) : (
                    <Button
                        className="w-full py-6 flex items-center justify-center rounded-md"
                        onClick={async () => {
                            const googleProvider = new GoogleAuthProvider();
                            try {
                                const res = await signInWithPopup(
                                    auth,
                                    googleProvider
                                );
                                setUser(res.user);
                            } catch (err) {
                                console.error(err);
                            }
                        }}
                    >
                        Acceder con <GoogleOutlined /> para ver esto
                    </Button>
                )}
            </div>
            {user && (
                <div className="m-4">
                    <Typography.Paragraph className="flex items-center justify-between">
                        Datos de pago{" "}
                        {showData ? (
                            <Typography.Link
                                onClick={() => setShowData((s) => !s)}
                                className="flex items-center"
                            >
                                Ocultar datos <EyeFilled className="ml-2" />
                            </Typography.Link>
                        ) : (
                            <Typography.Link
                                onClick={() => setShowData((s) => !s)}
                                className="flex items-center"
                            >
                                Ver datos <EyeOutlined className="ml-2" />
                            </Typography.Link>
                        )}
                    </Typography.Paragraph>
                    <Statistic
                        title="Alias"
                        value={"hernanpatronc"}
                        loading={!showData}
                    />
                    <Statistic
                        title="Banco"
                        value={"Santander"}
                        loading={!showData}
                    />
                    <Statistic
                        title="Cuenta"
                        value={"810-001368/0"}
                        loading={!showData}
                    />
                    <Statistic
                        title="Monto (aproximado)"
                        value={`ARS $ ${Math.round(
                            usd * 58.33
                        ).toLocaleString()}`}
                        loading={!showData}
                    />
                </div>
            )}
            <div className="m-4">
                <Typography.Title level={3}>
                    Información del viaje
                </Typography.Title>
                <iframe
                    style={{
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        width: "100%",
                    }}
                    width="800"
                    height="450"
                    src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FplYO7pIFuI28nCIKIxxYyk%2FColombia-2023%3Fnode-id%3D9%253A15%26scaling%3Dscale-down"
                    allowFullScreen
                ></iframe>
            </div>
            <div className="m-4">
                <Typography.Title level={3}>Itinerario/Mapa</Typography.Title>
                <iframe
                    src="https://www.google.com/maps/d/embed?mid=1upPN5V_1TKWavKvq00pUu-ZgurN7m5s&ehbc=2E312F"
                    width="640"
                    height="480"
                    style={{ width: "100%" }}
                ></iframe>
            </div>
            <div className="m-4">
                <Typography.Title level={3}>
                    Para irse dando manija...
                </Typography.Title>
                <Gallery />
            </div>
            <Modal
                visible={registerPayment}
                footer={null}
                destroyOnClose
                onCancel={() => setRegisterPayment(false)}
            >
                <Spin spinning={loading}>
                    <Form
                        layout="vertical"
                        onFinish={async (values) => {
                            setLoading(true);
                            await addDoc(collection(db, "pagos"), {
                                ...values,
                                uid: user?.uid,
                                email: user?.email,
                                photoURL: user?.photoURL,
                                fecha: values.fecha.toDate(),
                                deleted: false,
                            });
                            setRegisterPayment(false);
                            Modal.success({
                                title: "Pago registrado con éxito",
                                content:
                                    "¡Gracias por aportar para este viaje!",
                            });
                            setLoading(false);
                        }}
                        initialValues={{
                            nombre: user?.displayName,
                            medio: "transferencia",
                            fecha: moment(),
                        }}
                    >
                        <Form.Item label="Nombre" name="nombre">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label="Fecha"
                            name="fecha"
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor, ingrese una fecha",
                                },
                            ]}
                        >
                            <DatePicker className="w-full" />
                        </Form.Item>
                        <Form.Item
                            label="Monto"
                            name="monto"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Por favor, ingrese un monto válido",
                                },
                            ]}
                        >
                            <InputNumber prefix={"ARS $"} className="w-full" />
                        </Form.Item>
                        <Form.Item
                            label="Medio"
                            name="medio"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Por favor, ingrese un medio de pago",
                                },
                            ]}
                        >
                            <Select>
                                <Select.Option value="transferencia">
                                    Transferencia
                                </Select.Option>
                                <Select.Option value="efectivo">
                                    Efectivo
                                </Select.Option>
                                <Select.Option value="otro">Otro</Select.Option>
                            </Select>
                        </Form.Item>
                        <div>
                            <Button
                                htmlType="submit"
                                type="primary"
                                className="bg-primary-color border-primary-color text-black p-4 w-full mr-1 flex items-center justify-center rounded-md"
                            >
                                Registrar
                            </Button>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
}

export default App;
