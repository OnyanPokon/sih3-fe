import { AdminStatisticCard, AdminStatisticChart, DashboardProfileCard, HidrologiWsStatisticCard } from "@/components";
import { LeftOutlined, PlusOutlined, RightOutlined, } from "@ant-design/icons"
import { Button, Card } from "antd"
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

const HIdrologiDashboard = () => {

    const scrollRef = React.useRef(null);

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({
            left: -320,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({
            left: 320,
            behavior: "smooth",
        });
    };

    const data = [
        {
            type: "Informasi Teknis",
            value: 120,
            color: "#059669",
        },
        {
            type: "Berita",
            value: 90,
            color: "#2563EB",
        },
        {
            type: "Pos Pengamatan",
            value: 60,
            color: "#D97706",
        },
        {
            type: "Pemetaan GIS",
            value: 80,
            color: "#7C3AED",
        },
    ];

    const dataInWs = [
        {
            title: "Wilayah Sungai Bone Bolango",
            data: [
                {
                    label: "Informasi Teknis",
                    value: 120,
                },
                {
                    label: "Berita",
                    value: 80
                },
                {
                    label: "Pos Pengamatan",
                    value: 90
                },
                {
                    label: "Pemetaan GIS",
                    value: 20
                }
            ]
        },
        {
            title: "Wilayah Sungai Limboto",
            data: [
                {
                    label: "Informasi Teknis",
                    value: 120,
                },
                {
                    label: "Berita",
                    value: 80
                },
                {
                    label: "Pos Pengamatan",
                    value: 90
                },
                {
                    label: "Pemetaan GIS",
                    value: 20
                }
            ]
        },
        {
            title: "Wilayah Sungai Paguyaman",
            data: [
                {
                    label: "Informasi Teknis",
                    value: 120,
                },
                {
                    label: "Berita",
                    value: 80
                },
                {
                    label: "Pos Pengamatan",
                    value: 90
                },
                {
                    label: "Pemetaan GIS",
                    value: 20
                }
            ]
        },
    ]

   
    return (
        <div className="grid w-full grid-cols-12 gap-4">

            <div className="col-span-9 flex flex-col gap-y-4">
                <Card
                    title="Quick Access"
                    className="col-span-9 h-fit"
                >
                    <div className="grid grid-cols-12 gap-4">
                        <AdminStatisticCard label="Informasi Teknis" navigationPath="/dashboard/articles" value={120} />
                        <AdminStatisticCard label="Berita" navigationPath="/dashboard/news" value={90} />
                        <AdminStatisticCard label="Pemetaan GIS" navigationPath="/dashboard/maps" value={80} />
                        <AdminStatisticCard label="Pos Pengamatan" navigationPath="/dashboard/observation_pos" value={60} />
                    </div>
                </Card>
                <Card
                    title=" Berdasarkan Data Wilayah Sungai"
                    extra={
                        <div className="inline-flex gap-x-2">
                            <Button
                                shape="circle"
                                size="small"
                                icon={<LeftOutlined />}
                                onClick={scrollLeft}
                            />

                            <Button
                                shape="circle"
                                type="primary"
                                size="small"
                                icon={<RightOutlined />}
                                onClick={scrollRight}
                            />
                        </div>
                    }
                    className="w-full">
                    <div ref={scrollRef} className="w-full inline-flex items-center gap-x-6 overflow-x-auto pb-8">
                        {dataInWs.map((item, index) => (
                            <HidrologiWsStatisticCard key={index} label={item.title} data={item.data} />
                        ))}
                    </div>
                </Card>
                <Card
                    className="w-full"
                    title="Peta Sebaran Pos Pengamatan"
                    extra={
                        <Button className="" variant="outlined" shape="round" color="primary" icon={<PlusOutlined />} >
                            Kelola Pos
                        </Button>
                    }
                >
                    <MapContainer center={[0.5435, 123.056]} zoom={9} scrollWheelZoom className="h-[480px] rounded-xl">
                        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    </MapContainer>
                </Card>
            </div>
            <div className="col-span-3 flex flex-col gap-y-4">
                <DashboardProfileCard />
                <AdminStatisticChart data={data}/>

            </div>
        </div>

    )
}

export default HIdrologiDashboard