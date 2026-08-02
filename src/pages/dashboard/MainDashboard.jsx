import { BranchesOutlined, FilePdfOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Card, Typography } from 'antd'
import { CloudHail, Droplet, FileText, Gavel, Layers2, Map, Newspaper, Rss } from 'lucide-react'
import { MapContainer, TileLayer } from 'react-leaflet'

const MainDashboard = () => {
    return (
        <div className="grid w-full grid-cols-12 gap-4">
            <div className="w-full col-span-12 inline-flex items-center justify-between">
                <Typography.Title className="w-full" level={3}>
                    Dashboard SIH3
                </Typography.Title>
                <div className="inline-flex items-center gap-x-2 p-1.5 rounded-md bg-white">
                    <Button icon={<PlusOutlined />} variant="solid" color="primary">
                        Produk Hukum
                    </Button>
                    <Button icon={<UserAddOutlined />} variant="solid">
                        Personil
                    </Button>
                    <Button icon={<BranchesOutlined />} variant="solid">
                        Unor
                    </Button>
                </div>
            </div>
            <div className="col-span-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-8 flex flex-col gap-y-4 text-white">
                <div className="w-fit px-4 py-1 text-sm  rounded-full text-white bg-white/20 ">
                    Analisis Terbaru
                </div>
                <div className="w-full inline-flex items-center gap-x-4">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-white/20">
                        <Droplet size={38} />
                    </div>
                    <div className="flex flex-col ">
                        <Typography.Title level={3} style={{ color: "white", margin: 0 }}>
                            Data Hidrologi Provinsi Gorontalo
                        </Typography.Title>
                        <span>
                            Pantauan komprehensif data air permukaan
                        </span>
                    </div>

                </div>
                <div className="w-full grid grid-cols-12 gap-4">
                    <div className="col-span-3 p-4 bg-white/20 rounded-lg inline-flex items-center gap-x-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20">
                            <Newspaper size={28} />
                        </div>
                        <div className="flex flex-col ">
                            <small className="text-white/80" >
                                Informasi Teknis
                            </small>
                            <span className="text-xl">
                                124
                            </span>
                        </div>
                    </div>
                    <div className="col-span-3 p-4 bg-white/20 rounded-lg inline-flex items-center gap-x-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20">
                            <FileText size={28} />
                        </div>
                        <div className="flex flex-col ">
                            <small className="text-white/80" >
                                Berita
                            </small>
                            <span className="text-xl">
                                124
                            </span>
                        </div>
                    </div>
                    <div className="col-span-3 p-4 bg-white/20 rounded-lg inline-flex items-center gap-x-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20">
                            <Map size={28} />
                        </div>
                        <div className="flex flex-col ">
                            <small className="text-white/80" >
                                Pemetaan
                            </small>
                            <span className="text-xl">
                                124
                            </span>
                        </div>
                    </div>
                    <div className="col-span-3 p-4 bg-white/20 rounded-lg inline-flex items-center gap-x-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20">
                            <Rss size={28} />
                        </div>
                        <div className="flex flex-col ">
                            <small className="text-white/80" >
                                Pos Pengamatan
                            </small>
                            <span className="text-xl">
                                124
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-4 bg-white rounded-xl p-6 flex flex-col gap-y-6">
                <div className="inline-flex items-center gap-x-2 ">
                    <CloudHail className="text-green-500 " size={28} />
                    <span className="">
                        Hidrometeorologi
                    </span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-6 p-4 bg-gray-50 rounded-lg inline-flex items-center gap-x-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100 text-green-500">
                            <Newspaper size={28} />
                        </div>
                        <div className="flex flex-col ">
                            <small className="" >
                                Informasi Teknis
                            </small>
                            <span className="text-xl">
                                124
                            </span>
                        </div>
                    </div>
                    <div className="col-span-6 p-4 bg-gray-50 rounded-lg inline-flex items-center gap-x-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100 text-green-500">
                            <FileText size={28} />
                        </div>
                        <div className="flex flex-col ">
                            <small className="" >
                                Berita
                            </small>
                            <span className="text-xl">
                                124
                            </span>
                        </div>
                    </div>
                    <div className="col-span-6 p-4 bg-gray-50 rounded-lg inline-flex items-center gap-x-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100 text-green-500">
                            <Map size={28} />
                        </div>
                        <div className="flex flex-col ">
                            <small className="" >
                                Pemetaan
                            </small>
                            <span className="text-xl">
                                124
                            </span>
                        </div>
                    </div>
                    <div className="col-span-6 p-4 bg-gray-50 rounded-lg inline-flex items-center gap-x-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100 text-green-500">
                            <Rss size={28} />
                        </div>
                        <div className="flex flex-col ">
                            <small className="" >
                                Pos Pengamatan
                            </small>
                            <span className="text-xl">
                                124
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full col-span-8">
                <Card
                    className="w-full"
                    title="Peta Sebaran Pos Pengamatan"
                >
                    <MapContainer center={[0.5435, 123.056]} zoom={9} scrollWheelZoom className="h-[480px] rounded-xl">
                        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    </MapContainer>
                </Card>
            </div>
            <div className="w-full col-span-4 flex flex-col gap-y-4">
                <div className=" bg-white rounded-xl p-6 flex flex-col gap-y-6 h-fit">
                    <div className="inline-flex items-center gap-x-2 ">
                        <Layers2 className="text-amber-500 " size={28} />
                        <span className="">
                            Hidrogeologi
                        </span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-6 p-4 bg-gray-50 rounded-lg inline-flex items-center gap-x-3">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-100 text-amber-500">
                                <Newspaper size={28} />
                            </div>
                            <div className="flex flex-col ">
                                <small className="" >
                                    Informasi Teknis
                                </small>
                                <span className="text-xl">
                                    124
                                </span>
                            </div>
                        </div>
                        <div className="col-span-6 p-4 bg-gray-50 rounded-lg inline-flex items-center gap-x-3">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-100 text-amber-500">
                                <FileText size={28} />
                            </div>
                            <div className="flex flex-col ">
                                <small className="" >
                                    Berita
                                </small>
                                <span className="text-xl">
                                    124
                                </span>
                            </div>
                        </div>
                        <div className="col-span-6 p-4 bg-gray-50 rounded-lg inline-flex items-center gap-x-3">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-100 text-amber-500">
                                <Map size={28} />
                            </div>
                            <div className="flex flex-col ">
                                <small className="" >
                                    Pemetaan
                                </small>
                                <span className="text-xl">
                                    124
                                </span>
                            </div>
                        </div>
                        <div className="col-span-6 p-4 bg-gray-50 rounded-lg inline-flex items-center gap-x-3">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-100 text-amber-500">
                                <Rss size={28} />
                            </div>
                            <div className="flex flex-col ">
                                <small className="" >
                                    Pos Pengamatan
                                </small>
                                <span className="text-xl">
                                    124
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" bg-white rounded-xl p-6 flex flex-col gap-y-3 h-fit">
                    <div className="inline-flex items-center gap-x-2 ">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-100 text-red-500">
                            <Gavel size={28} />
                        </div>
                        <div className="flex flex-col ">
                            <small className="" >
                                Total Produk Hukum
                            </small>
                            <span className="text-xl">
                                124
                            </span>
                        </div>
                    </div>
                    <hr />
                    <p className="font-semibold">
                        Baru ini diunggah :
                    </p>
                    <div className=" w-full p-4 rounded-lg bg-gray-100  inline-flex items-center justify-between">
                        <div className="flex flex-col gap-y-1">
                            <span className="font-semibold">
                                UU Rampasan Hak Aset
                            </span>
                            <small>
                                BMKG - 2 Hari yang lalu
                            </small>
                        </div>
                        <Button icon={<FilePdfOutlined />} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MainDashboard