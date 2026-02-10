import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Plus, Sparkles, ChevronRight, Check } from 'lucide-react';
import Api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ContactCard from '../components/ui/ContactCard';

const ClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = new Api();
    const [activeTab, setActiveTab] = useState('overview');

    const [loading, setLoading] = useState(true);
    const [client, setClient] = useState(null);
    const [contracts, setContracts] = useState([]);

    // AI Insight State (Mocked)
    const [generatingInsight, setGeneratingInsight] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [clientRes, contractsRes] = await Promise.all([
                    api.get(`/clientes/${id}`),
                    api.get(`/contratos/cliente/${id}`) // Make sure API supports this or filter client side
                ]);

                // If API doesn't support filtering by client ID directly in mock yet, we might need to fetch all and filter.
                // But let's assume our verify step confirmed it or we fix it.
                // Actually looking at previous Api.js, I added regex for ` /contratos/cliente/:id` 

                setClient(clientRes.cliente);
                setContracts(contractsRes.contratos || []); // Fallback if endpoint returns all or nothing
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="space-y-4"><Skeleton className="h-40 w-full" /><div className="grid grid-cols-3 gap-4"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div></div>;

    if (!client) return <div>Cliente não encontrado</div>;

    // Metrics Calculation
    const activeContracts = contracts.filter(c => c.status === 'Ativo');
    const totalARR = activeContracts.reduce((acc, c) => {
        const value = Number(c.valor);
        return acc + (c.tipoFaturamento === 'Mensal' ? value * 12 : value);
    }, 0);
    // Find next renewal (arbitrary logic for mock: closest 'fim' date in future)
    const nextRenewal = contracts
        .filter(c => c.status === 'Ativo' && new Date(c.fim) > new Date())
        .sort((a, b) => new Date(a.fim) - new Date(b.fim))[0];

    const handleGenerateInsight = () => {
        setGeneratingInsight(true);
        setTimeout(() => setGeneratingInsight(false), 2000); // Simulate API call
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/clientes')} className="p-2"><ArrowLeft className="w-5 h-5" /></Button>
                        <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700 text-xl font-bold">
                            {client.nomeFantasia.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{client.nomeFantasia}</h1>
                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                <span>CNPJ: {client.cnpj}</span>
                                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                <span>{client.segmento}</span>
                                <Badge variant={client.status === 'Ativo' ? 'success' : 'secondary'}>{client.status}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" icon={Edit2} onClick={() => navigate(`/clientes/editar/${id}`)}>Editar Cliente</Button>
                        <Button icon={Plus} onClick={() => navigate('/contratos/novo')}>Novo Contrato</Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mt-8 border-b border-slate-200">
                    {['Overview', 'Contatos', 'Contratos', 'Histórico'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === tab.toLowerCase()
                                ? 'text-teal-600 border-b-2 border-teal-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab === 'Overview' ? 'Visão Geral' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6">
                            <h3 className="text-sm font-medium text-slate-500 mb-2">Receita Anual Recorrente (ARR)</h3>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalARR)}</p>
                            <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                                <span className="bg-emerald-100 px-1.5 py-0.5 rounded">+12%</span> vs ano anterior
                            </div>
                        </Card>
                        <Card className="p-6">
                            <h3 className="text-sm font-medium text-slate-500 mb-2">Contratos Ativos</h3>
                            <p className="text-2xl font-bold text-slate-900">{activeContracts.length}</p>
                        </Card>
                        <Card className="p-6">
                            <h3 className="text-sm font-medium text-slate-500 mb-2">Próxima Renovação</h3>
                            <p className="text-2xl font-bold text-slate-900">{nextRenewal ? formatDate(nextRenewal.fim) : '-'}</p>
                            {nextRenewal && <p className="text-sm text-amber-600">Faltam {Math.ceil((new Date(nextRenewal.fim) - new Date()) / (1000 * 60 * 60 * 24))} dias</p>}
                        </Card>
                    </div>

                    {/* AI Banner */}
                    <div
                        className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
                        onClick={handleGenerateInsight}
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-full shadow-sm">
                                <Sparkles className={`w-6 h-6 text-purple-600 ${generatingInsight ? 'animate-spin' : ''}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    Inteligência Estratégica
                                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">Gemini AI</span>
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {generatingInsight
                                        ? "Analisando perfil do cliente e histórico de contratos..."
                                        : "Clique para gerar oportunidades de Upsell e análise de riscos."}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-purple-700 group-hover:bg-purple-100 hover:text-purple-900">
                            {generatingInsight ? 'Gerando...' : 'Analisar Agora'}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="font-bold mb-4 text-slate-900">Principais Contatos</h3>
                            <div className="space-y-4">
                                {/* Simplified List for Overview */}
                                {[
                                    { role: 'Gestor de Contratos', name: client.gestor_contratos_nome, email: client.gestor_contratos_email },
                                    { role: 'Gestor Financeiro', name: client.gestor_financeiro_nome, email: client.gestor_financeiro_email }
                                ].filter(Boolean).map((contact, idx) => (
                                    contact.name ? (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer" onClick={() => setActiveTab('contatos')}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">
                                                    {contact.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                                                    <p className="text-xs text-slate-500">{contact.role}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                    ) : null
                                ))}
                                {(!client.gestor_contratos_nome && !client.gestor_financeiro_nome) && <p className="text-slate-500 text-sm">Nenhum contato cadastrado.</p>}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-bold mb-4 text-slate-900">Últimos Contratos</h3>
                            <div className="space-y-3">
                                {contracts.slice(0, 4).map(c => (
                                    <div key={c.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                        <div>
                                            {/* We need product name here. In real app, we would have fetched it. Mock contracts have produtoId. 
                                                Fetching products or assuming mock contracts have 'product' field (MOCK_CONTACTS in request had 'product' field string,
                                                our MOCK_CONTRATOS in constants.js has 'produtoId'. 
                                                For this Quick View, let's just show ID or fetch products later.
                                                Ideally we should have fetched logic. 
                                                Let's assume our backend returns augmented data or we fetch products map.
                                                For now rendering ID to avoid complexities in this single file or a generic name.
                                             */}
                                            <p className="font-medium text-slate-800">Contrato #{c.id}</p>
                                            <p className="text-xs text-slate-500">{formatDate(c.fim)}</p>
                                        </div>
                                        <Badge variant={c.status === 'Ativo' ? 'success' : 'secondary'}>{c.status}</Badge>
                                    </div>
                                ))}
                                {contracts.length === 0 && <p className="text-sm text-slate-500">Nenhum contrato encontrado.</p>}
                            </div>
                        </Card>
                    </div>
                </>
            )}

            {activeTab === 'contatos' && (
                <div className="space-y-8">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-4">Gestores Principais</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ContactCard title="Gestor de Contratos"
                                name={client.gestor_contratos_nome}
                                email={client.gestor_contratos_email}
                                phone={client.gestor_contratos_telefone_1}
                            />
                            <ContactCard title="Gestor Financeiro"
                                name={client.gestor_financeiro_nome}
                                email={client.gestor_financeiro_email}
                                phone={client.gestor_financeiro_telefone_1}
                            />
                            <ContactCard title="Gestor de Chamados"
                                name={client.gestor_chamados_nome}
                                email={client.gestor_chamados_email}
                                phone={client.gestor_chamados_telefone_1}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-slate-900">Contatos Comerciais</h3>
                            <Button variant="ghost" size="sm" icon={Plus}>Adicionar</Button>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-8 text-center text-slate-500 border border-dashed border-slate-300">
                            Nenhum contato comercial adicional cadastrado.
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-slate-900">Contatos Técnicos</h3>
                            <Button variant="ghost" size="sm" icon={Plus}>Adicionar</Button>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-8 text-center text-slate-500 border border-dashed border-slate-300">
                            Nenhum contato técnico adicional cadastrado.
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'contratos' && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Produto (ID)</th>
                                <th className="px-6 py-3">Valor</th>
                                <th className="px-6 py-3">Inicio</th>
                                <th className="px-6 py-3">Fim</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {contracts.map(contract => (
                                <tr key={contract.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/contratos/${contract.id}`)}>
                                    <td className="px-6 py-4 font-mono text-slate-500">#{contract.id}</td>
                                    <td className="px-6 py-4">{contract.produtoId}</td>
                                    <td className="px-6 py-4 font-medium">{formatCurrency(contract.valor)}</td>
                                    <td className="px-6 py-4">{formatDate(contract.inicio)}</td>
                                    <td className="px-6 py-4">{formatDate(contract.fim)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant={contract.status === 'Ativo' ? 'success' : 'secondary'}>{contract.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" className="text-teal-600">Ver</Button>
                                    </td>
                                </tr>
                            ))}
                            {contracts.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                        Nenhum contrato encontrado para este cliente.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'histórico' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-900">Fatos Relevantes</h3>
                        <Button variant="outline" size="sm" icon={Plus}>Novo Fato</Button>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="w-2 h-2 rounded-full bg-slate-300 mt-2"></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Cliente criado no sistema (Legado)</p>
                                <p className="text-xs text-slate-500 mt-1">01/01/2023 às 10:00 por Sistema</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-8 text-center text-slate-500 border border-dashed border-slate-300">
                        Nenhum outro registro de histórico encontrado.
                    </div>
                </div>
            )}

            <div className="mt-12 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Zona de Perigo</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="font-medium text-red-900">Inativar Cliente</p>
                        <p className="text-sm text-red-700 mt-1">Ao inativar o cliente, todos os contratos ativos serão automaticamente suspensos.</p>
                    </div>
                    <Button
                        variant="secondary"
                        className="bg-white border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                        onClick={() => {
                            if (window.confirm("FATAL: Tem certeza? Isso inativará todos os contratos deste cliente.")) {
                                alert("Cliente inativado (Mock)");
                            }
                        }}
                    >
                        Inativar Cliente
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ClientDetails;
