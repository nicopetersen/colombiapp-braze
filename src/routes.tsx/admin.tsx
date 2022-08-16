import { ReloadOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Modal,
    PageHeader,
    Spin,
    Table,
    Typography,
} from "antd";
import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { db } from "../services/firebase";

export const Admin = () => {
    const [pagos, setPagos] = useState([]);
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, "pagos"), where("deleted", "!=", true));

        getDocs(q).then((querySnapshot) => {
            setPagos(
                querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
            setLoading(false);
        });
        // querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log(doc.id, " => ", doc.data());
        // });
    }, [count]);
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
            {user?.uid == "5heOGTQ66XO4tskSWdF1ZaKwZgm2" ? (
                <Spin spinning={loading}>
                    <Table
                        dataSource={pagos}
                        pagination={false}
                        showHeader={false}
                    >
                        <Table.Column
                            title=""
                            render={(value, pago: any) => (
                                <Avatar src={pago.photoURL} />
                            )}
                        />
                        <Table.Column
                            title="Nombre"
                            render={(value, pago: any) => pago.nombre}
                        />
                        <Table.Column
                            title="Fecha"
                            render={(value, pago: any) => {
                                return moment(pago.fecha.seconds * 1000).format(
                                    "DD/MM/yyyy"
                                );
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
                            render={(value, pago: any) =>
                                `ARS $${pago.monto.toLocaleString()}`
                            }
                        />
                        <Table.Column
                            title="Medio"
                            render={(value, pago: any) => pago.medio}
                        />
                        <Table.Column
                            title="Acción"
                            render={(value, pago: any) => (
                                <Button
                                    onClick={() => {
                                        Modal.confirm({
                                            title: "¿Estás seguro?",
                                            content: `Estás a punto de eliminar este pago de ${pago.nombre} por ARS $ ${pago.monto}`,
                                            onOk: async () => {
                                                console.log(pago.id);
                                                const pagoRef = doc(
                                                    db,
                                                    "pagos",
                                                    pago.id
                                                );
                                                await setDoc(
                                                    pagoRef,
                                                    { deleted: true },
                                                    { merge: true }
                                                );
                                                setCount((c) => c + 1);
                                            },
                                        });
                                    }}
                                    className="rounded-md"
                                    danger
                                >
                                    Eliminar
                                </Button>
                            )}
                        />
                    </Table>
                </Spin>
            ) : (
                <Typography.Paragraph>
                    No puedes acceder a esta información
                </Typography.Paragraph>
            )}
            <Button type="link" onClick={() => setCount((c) => c + 1)}>
                <ReloadOutlined />
            </Button>
        </div>
    );
};
