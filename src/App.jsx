import axios from "axios";
import { useState, useEffect } from "react";

const App = () => {
    const [daftarProfesi, setDaftarProfesi] = useState([]);
    const [currentId, setCurrentId] = useState(-1);
    const [input, setInput] = useState({
        name: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://test-case.fe.can.co.id/api/hobby`);
                const profesi = response.data;
                setDaftarProfesi(profesi.data);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setInput({ ...input, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentId === -1) {
            axios
                .post(`https://test-case.fe.can.co.id/api/hobby`, input)
                .then(() => {
                    setDaftarProfesi([...daftarProfesi, input]);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            axios.put(`https://test-case.fe.can.co.id/api/hobby/${currentId}`, input).then(() => {
                daftarProfesi.find((profesi) => (profesi.id === currentId ? { ...profesi, input } : profesi));
                setDaftarProfesi([...daftarProfesi]);
                setCurrentId(-1);
            });
        }

        setInput({
            name: "",
        });
    };

    const handleEdit = (event) => {
        let id = parseInt(event.target.value);
        axios.get(`https://test-case.fe.can.co.id/api/hobby/${id}`).then((response) => {
            let profesi = response.data.data;

            setInput({
                name: profesi.name,
            });

            setCurrentId(profesi.id);
        });
    };

    const handleReset = (event) => {
        event.preventDefault();

        setInput({
            name: "",
        });

        setCurrentId(-1);
    };

    const handleDelete = (event) => {
        let id = parseInt(event.target.value);

        axios.delete(`https://test-case.fe.can.co.id/api/hobby/${id}`).then(() => {
            let newProfesi = daftarProfesi.filter((profesi) => {
                return profesi.id !== id;
            });

            setDaftarProfesi([...newProfesi]);
        });
    };

    return (
        <div className="min-h-screen w-full bg-custom flex space-x-5 p-5 relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-4/12 h-2/3 p-5 rounded-lg shadow-xl border-purple-200 border-2 bg-purple-200 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30">
                <h4 className="w-full text-2xl font-bold mb-6 uppercase text-center text-indigo-800 ">
                    {currentId === -1 ? "Tambah Data Hobby" : "Edit Data Hobby"}
                </h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="nama" className="block mb-1 text-xs font-medium text-indigo-900 uppercase">
                            Nama Profesi
                        </label>
                        <input
                            onChange={handleChange}
                            value={input.name}
                            type="text"
                            name="name"
                            className="bg-gray-50 border border-gray-300 text-indigo-500 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-300 focus:placeholder-gray-300"
                            placeholder="Developer"
                            required
                        />
                    </div>

                    {currentId === -1 ? (
                        <div className="text-center">
                            <button
                                type="submit"
                                className="text-white bg-indigo-500 hover:bg-indigo-600 font-medium rounded-lg text-sm w-full px-5 py-2.5 uppercase transition-all duration-150"
                            >
                                Submit
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-3">
                            <button
                                className="text-white bg-rose-500 hover:bg-rose-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-6/12 px-5 py-2.5 uppercase"
                                onClick={handleReset.bind(this)}
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="text-white bg-indigo-500 hover:bg-indigo-600 font-medium rounded-lg text-sm w-6/12 px-5 py-2.5 uppercase"
                            >
                                Update
                            </button>
                        </div>
                    )}
                </form>
            </div>
            <div className="w-8/12">
                <table className="min-w-max w-full table-auto shadow-xl">
                    <thead>
                        <tr className="bg-indigo-500 text-gray-100 uppercase text-sm bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-70">
                            <th className="py-3 px-3 text-left">No</th>
                            <th className="py-3 px-3 text-left">Nama</th>
                            <th className="py-3 px-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {daftarProfesi.map((profesi, index) => {
                            return (
                                <tr
                                    className="bg-purple-200 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 text-gray-50"
                                    key={index}
                                >
                                    <td className="py-3 px-3">
                                        <span className="font-bold">{index + 1}</span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="font-medium">{profesi.name}</span>
                                    </td>
                                    <td className="py-3 px-2 text-left">
                                        <div className="flex item-center space-x-1">
                                            <button
                                                className="py-1 px-2 rounded transform bg-purple-600 text-gray-100 hover:bg-purple-700 hover:text-gray-50 hover:scale-110 cursor-pointer text-xs transition-all duration-200"
                                                onClick={handleEdit}
                                                value={profesi.id}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="py-1 px-2 rounded transform bg-rose-500 text-gray-100 hover:bg-gray-100 hover:text-rose-500 hover:scale-110 cursor-pointer text-xs transition-all duration-200"
                                                onClick={handleDelete}
                                                value={profesi.id}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default App;
