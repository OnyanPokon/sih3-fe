import { useAuth } from '@/hooks'
import { FolderFilled } from '@ant-design/icons'
import { Card, Skeleton, Typography } from 'antd'

const DashboardProfileCard = () => {
    const { user } = useAuth();

    return (
        <Card title="Profil">
            <div className="flex flex-col items-center justify-center gap-y-2">

                {/* Avatar */}
                {!user ? (
                    <Skeleton.Avatar active size={80} shape="circle" />
                ) : (
                    <div className="p-2 border border-blue-500 rounded-full">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-3xl font-semibold">
                            SA
                        </div>
                    </div>
                )}

                {/* Nama */}
                <div className="flex flex-col items-center text-center gap-y-2">
                    {!user ? (
                        <>
                            <Skeleton.Input
                                active
                                size="small"
                                style={{ width: 180 }}
                            />
                            <Skeleton.Input
                                active
                                size="small"
                                style={{ width: 240 }}
                            />
                        </>
                    ) : (
                        <>
                            <Typography.Title level={5} style={{ margin: 0 }}>
                                Hai! 👋 {user?.name}
                            </Typography.Title>

                            <span className="text-xs text-gray-500">
                                {user?.unor?.nama} - Personil{" "}
                                {user?.unor?.kategoris?.map((k) => k.nama).join(", ")}
                            </span>
                        </>
                    )}
                </div>

                <hr className="w-full my-2" />

                <span className="w-full text-xs font-semibold">
                    Publikasi Terakhir :
                </span>

                <div className="w-full px-3 bg-blue-50/60 rounded-md divide-y">
                    {!user ? (
                        <div className="flex items-center gap-3 py-3">
                            <Skeleton.Avatar active shape="square" size={40} />
                            <div className="flex-1">
                                <Skeleton.Input
                                    active
                                    size="small"
                                    style={{ width: "70%", marginBottom: 8 }}
                                />
                                <Skeleton.Input
                                    active
                                    size="small"
                                    style={{ width: "45%" }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-x-2 py-3">
                            <FolderFilled className="text-blue-700 text-2xl" />
                            <div className="flex flex-col">
                                <p className="text-xs font-semibold">
                                    Pos Pengamatan
                                </p>
                                <span className="text-xs text-gray-500">
                                    Berita - 2 Hari yang lalu
                                </span>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </Card>
    )
}

export default DashboardProfileCard