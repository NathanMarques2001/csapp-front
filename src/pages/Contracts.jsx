import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronLeft, ChevronRight, Eye, FileText, TrendingUp, DollarSign, Upload, Download } from 'lucide-react';
import Api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import ImportContractsModal from '../components/contracts/ImportContractsModal';

const Contracts = () => {
    const api = new Api();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [contracts, setContracts] = useState([]);
    const [filteredContracts, setFilteredContracts] = useState([]);
    const [clients, setClients] = useState({});
    const [products, setProducts] = useState({});

    // Import Modal State
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [contractsRes, clientsRes, productsRes] = await Promise.all([
                    api.get('/contratos'),
                    api.get('/clientes'),
                    api.get('/produtos')
                ]);

                const clientsMap = (clientsRes.clientes || []).reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
                const productsMap = (productsRes.produtos || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

                setClients(clientsMap);
                setProducts(productsMap);
                setContracts(contractsRes.contratos || []);
                setFilteredContracts(contractsRes.contratos || []);
            } catch (error) {
                console.error("Error loading contracts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let results = contracts;

        if (statusFilter) {
            results = results.filter(c => c.status === statusFilter);
        }

        if (productFilter) {
            const productName = products[productFilter]?.nome;
            // Filter by exact product ID match if possible, or name if stored differently. 
            // Assuming contract stores productId
            results = results.filter(c => String(c.produtoId) === productFilter);
        }

        if (searchTerm) {
            results = results.filter(c => {
                const client = clients[c.clienteId];
                return client?.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    client?.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        setFilteredContracts(results);
        setCurrentPage(1);
    }, [searchTerm, statusFilter, productFilter, contracts, clients, products]);

    // Calculations
    const totalActive = filteredContracts.reduce((acc, c) => acc + (c.status === 'Ativo' ? Number(c.valor) : 0), 0);
    const totalMonthly = filteredContracts.filter(c => c.tipoFaturamento === 'Mensal').reduce((acc, c) => acc + Number(c.valor), 0);
    const totalAnnual = filteredContracts.filter(c => c.tipoFaturamento === 'Anual').reduce((acc, c) => acc + Number(c.valor), 0);
    const totalDisplayed = filteredContracts.reduce((acc, c) => acc + Number(c.valor || 0), 0);

    const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
    const paginatedContracts = filteredContracts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleImport = (file) => {
        console.log("Importing file:", file);
        // Here you would call the API to import
        alert("Importação iniciada com sucesso (Mock)");
        setIsImportModalOpen(false);
    };

    const StatsCard = ({ title, value, icon: Icon, color }) => (
        <Card className="p-4 flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 font-medium">{title}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(value)}</p>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
        </Card>
    );

    // Filter Options
    const productOptions = useMemo(() => {
        return Object.values(products).map(p => ({ value: String(p.id), label: p.nome }));
    }, [products]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Contratos</h1>
                    <p className="text-slate-500">Gestão de contratos e faturamentos</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setIsImportModalOpen(true)} icon={Upload}>Importar</Button>
                    <Button onClick={() => navigate('/contratos/novo')} icon={Plus}>Novo Contrato</Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard title="Total Ativo (Filtro)" value={totalActive} icon={TrendingUp} color="bg-teal-500" />
                <StatsCard title="Faturamento Mensal" value={totalMonthly} icon={DollarSign} color="bg-indigo-500" />
                <StatsCard title="Faturamento Anual" value={totalAnnual} icon={FileText} color="bg-blue-500" />
            </div>

            {/* Filters */}
            <Card className="p-4 border-0 shadow-sm bg-white grid md:grid-cols-[1fr_200px_200px] gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Buscar por cliente..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
                    <option value="">Todos Produtos</option>
                    {productOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </Select>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">Todos Status</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Pendente">Pendente</option>
                </Select>
            </Card>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Produto</th>
                                    <th className="px-6 py-3">Valor</th>
                                    <th className="px-6 py-3">Recorrência</th>
                                    <th className="px-6 py-3">Fim Vigência</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedContracts.length > 0 ? (
                                    paginatedContracts.map((contract) => (
                                        <tr key={contract.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/contratos/${contract.id}`)}>
                                            <td className="px-6 py-4 font-mono text-slate-500">#{contract.id}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {clients[contract.clienteId]?.nomeFantasia || 'Cliente Desconhecido'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {products[contract.produtoId]?.nome || `Produto ${contract.produtoId}`}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700">{formatCurrency(contract.valor)}</td>
                                            <td className="px-6 py-4 text-slate-500">{contract.tipoFaturamento}</td>
                                            <td className="px-6 py-4 text-slate-500">{formatDate(contract.fim)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant={contract.status === 'Ativo' ? 'success' : 'secondary'}>
                                                    {contract.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); navigate(`/contratos/${contract.id}`); }}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                                            Nenhum contrato encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-slate-50 font-semibold text-slate-900 border-t border-slate-200">
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-right">
                                        Total (Página):
                                    </td>
                                    <td className="px-6 py-4 text-teal-700">
                                        {formatCurrency(paginatedContracts.reduce((acc, c) => acc + Number(c.valor || 0), 0))}
                                    </td>
                                    <td colSpan="4"></td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-right border-t border-slate-200">
                                        Total Geral (Filtro):
                                    </td>
                                    <td className="px-6 py-4 text-indigo-700 border-t border-slate-200">
                                        {formatCurrency(totalDisplayed)}
                                    </td>
                                    <td colSpan="4" className="border-t border-slate-200"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-slate-500 text-sm">
                                Página {currentPage} de {totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                ><ChevronLeft className="w-4 h-4" /></Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                ><ChevronRight className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <ImportContractsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />
        </div>
    );
};

export default Contracts;
