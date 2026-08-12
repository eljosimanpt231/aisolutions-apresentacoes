import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, Inbox as InboxIcon, MessageSquare, ChevronDown, ChevronRight,
  AtSign, AlertCircle, Folder, Users, BarChart3, Megaphone, HelpCircle,
  Settings, SlidersHorizontal, ArrowDownUp, Smile, Paperclip, Mic, Sparkles,
  Send, CheckCircle2, UserCircle2, MoreVertical, ArrowLeftRight, Bot,
  CheckCheck, Phone, Mail, Plus, Zap, CalendarClock, StickyNote, History,
  Tag, X, Instagram, Facebook, Info,
} from "lucide-react";
import { SectionWrapper, SectionHeading } from "@/components/shared/SectionWrapper";

const T = {
  bg: "#0a0a0f",
  surface1: "#111118",
  surface2: "#14141c",
  surface3: "#1f1f2a",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",
  text: "#ededed",
  textSoft: "rgba(237,237,237,0.85)",
  textMuted: "rgba(237,237,237,0.55)",
  primary: "#00d4aa",
  primaryFg: "#04130f",
  accent: "rgba(255,255,255,0.06)",
  whatsapp: "#25D366",
  instagram: "#e1306c",
  labelTeal: "#00d4aa",
  labelBlue: "#3a86ff",
  labelGold: "#E8B84B",
  labelRose: "#f472b6",
  labelViolet: "#a78bfa",
  labelRed: "#ef4444",
};

type Channel = "email" | "instagram" | "facebook" | "whatsapp";
type LabelKey =
  | "animacao"
  | "aluguer"
  | "campos_ferias"
  | "formacao"
  | "mercado_natal"
  | "duvida";
type Tab = "mine" | "unassigned" | "all";

interface Message {
  id: number;
  sender: "client" | "agent" | "system";
  text: string;
  time: string;
  agentName?: string;
  isAI?: boolean;
}

interface Conversation {
  id: number;
  name: string;
  initials: string;
  phone: string;
  email?: string;
  account: string;
  channel: Channel;
  label: LabelKey;
  tab: "mine" | "unassigned";
  timeAgo: string;
  unread?: number;
  preview: string;
  messages: Message[];
  attributes?: { key: string; value: string }[];
  notes?: string[];
}

const labelMeta: Record<LabelKey, { name: string; color: string }> = {
  animacao:       { name: "animação",         color: T.labelTeal },
  aluguer:        { name: "aluguer de espaço", color: T.labelBlue },
  campos_ferias:  { name: "campos de férias", color: T.labelRose },
  formacao:       { name: "formação",         color: T.labelGold },
  mercado_natal:  { name: "mercado de Natal", color: T.labelViolet },
  duvida:         { name: "dúvida geral",     color: T.labelRed },
};

const labelPriority: Record<LabelKey, number> = {
  mercado_natal: 0,
  animacao: 1,
  aluguer: 2,
  formacao: 3,
  campos_ferias: 4,
  duvida: 5,
};

const ACCOUNTS = ["OF Eventos", "OF Formação", "Summerpolis"];

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Nortec Sistemas",
    initials: "NS",
    phone: "+351 229 440 118",
    email: "eventos@nortecsistemas.pt",
    account: "OF Eventos",
    channel: "email",
    label: "animacao",
    tab: "unassigned",
    timeAgo: "9m",
    unread: 1,
    preview: "Parece-nos bem. Podem confirmar a disponibilidade?",
    messages: [
      { id: 1, sender: "client", text: "Queríamos 2 cuspidores de fogo, 2 malabaristas e 2 palhaços, das 18h às 21h.", time: "09:32" },
      { id: 2, sender: "agent", isAI: true, agentName: "Agente AI Solutions", text: "Com deslocação incluída, fica em 1.480,00 € mais IVA. A equipa confirma a disponibilidade.", time: "09:33" },
      { id: 3, sender: "client", text: "Parece-nos bem. Podem confirmar a disponibilidade?", time: "09:41" },
    ],
    attributes: [
      { key: "Tipo de cliente", value: "Empresa" },
      { key: "Data do evento",  value: "12 dez" },
      { key: "Serviços",        value: "Fogo, malabares, palhaços" },
      { key: "N.º de pessoas",  value: "180" },
      { key: "Local",           value: "Maia" },
      { key: "Proposta n.º",    value: "214" },
    ],
    notes: ["Pedido padronizado, respondido pelo agente com valor de tabela."],
  },
  {
    id: 2,
    name: "Cláudia Nunes",
    initials: "CN",
    phone: "+351 916 220 447",
    email: "claudia.nunes@gmail.com",
    account: "OF Formação",
    channel: "whatsapp",
    label: "aluguer",
    tab: "unassigned",
    timeAgo: "32m",
    preview: "Sim, coffee break de manhã e à tarde.",
    messages: [
      { id: 1, sender: "client", text: "Queria alugar uma sala para 30 pessoas, dia inteiro.", time: "09:10" },
      { id: 2, sender: "agent", isAI: true, agentName: "Agente AI Solutions", text: "Dia inteiro com montagem e equipamento: 320,00 € mais IVA.", time: "09:11" },
      { id: 3, sender: "client", text: "Sim, coffee break de manhã e à tarde.", time: "09:18" },
    ],
    attributes: [
      { key: "Tipo de cliente", value: "Particular" },
      { key: "Data do evento",  value: "20 set" },
      { key: "Serviços",        value: "Sala OF, coffee break" },
      { key: "N.º de pessoas",  value: "30" },
      { key: "Local",           value: "Sala OF" },
    ],
    notes: ["Pedido padronizado, respondido pelo agente com valor de tabela.", "Entrou pelo widget de WhatsApp do site."],
  },
  {
    id: 3,
    name: "Câmara Municipal",
    initials: "CM",
    phone: "+351 256 330 900",
    email: "cultura@cm-exemplo.pt",
    account: "OF Eventos",
    channel: "email",
    label: "mercado_natal",
    tab: "mine",
    timeAgo: "1 d",
    unread: 2,
    preview: "Animação diária durante 15 dias, decoração e cenografia.",
    messages: [
      { id: 1, sender: "client", text: "Precisamos de animação diária durante 15 dias e cenografia da praça.", time: "17:02" },
      { id: 2, sender: "agent", isAI: true, agentName: "Agente AI Solutions", text: "É um projeto à medida. Encaminhei já para o responsável.", time: "17:02" },
      { id: 3, sender: "system", text: "Conversa encaminhada para a equipa OF, projeto à medida.", time: "17:03" },
      { id: 4, sender: "client", text: "Com certeza. A praça está disponível para visita na quinta de manhã.", time: "18:40" },
    ],
    attributes: [
      { key: "Tipo de cliente", value: "Institucional" },
      { key: "Data do evento",  value: "1 a 15 dez" },
      { key: "Serviços",        value: "Animação, cenografia" },
      { key: "Local",           value: "Praça do município" },
    ],
    notes: ["Projeto à medida, encaminhado para o responsável.", "Visita à praça marcada para quinta de manhã."],
  },
  {
    id: 4,
    name: "Marta Pinheiro",
    initials: "MP",
    phone: "Instagram @marta.pinheiro",
    account: "OF Eventos",
    channel: "instagram",
    label: "animacao",
    tab: "unassigned",
    timeAgo: "1 d",
    preview: "Vi o vosso vídeo do casamento, fazem também para 80 pessoas?",
    messages: [
      { id: 1, sender: "client", text: "Vi o vosso vídeo do casamento, fazem também para 80 pessoas?", time: "21:14" },
      { id: 2, sender: "agent", isAI: true, agentName: "Agente AI Solutions", text: "Fazemos, sim. Diga-me a data e o local que já lhe dou uma estimativa.", time: "21:14" },
    ],
    attributes: [
      { key: "Tipo de cliente", value: "Particular" },
      { key: "Data do evento",  value: "7 jun" },
      { key: "Serviços",        value: "Animação de casamento" },
      { key: "N.º de pessoas",  value: "80" },
    ],
    notes: ["Falta a data e o local para fechar a estimativa."],
  },
  {
    id: 5,
    name: "Sr. Almeida",
    initials: "SA",
    phone: "+351 934 771 205",
    email: "almeida@grupolinha.pt",
    account: "OF Eventos",
    channel: "email",
    label: "animacao",
    tab: "mine",
    timeAgo: "2 d",
    preview: "A proposta está boa, só queria trocar os malabaristas.",
    messages: [
      { id: 1, sender: "agent", isAI: true, agentName: "Agente AI Solutions", text: "Seguimento automático da proposta n.º 209, enviada há 48 horas.", time: "10:00" },
      { id: 2, sender: "client", text: "A proposta está boa, só queria trocar os malabaristas.", time: "11:26" },
      { id: 3, sender: "agent", isAI: true, agentName: "Agente AI Solutions", text: "Passo ao responsável, que apresenta alternativas infantis hoje.", time: "11:27" },
    ],
    attributes: [
      { key: "Tipo de cliente", value: "Empresa" },
      { key: "Data do evento",  value: "3 out" },
      { key: "Serviços",        value: "Animação de aniversário" },
      { key: "N.º de pessoas",  value: "120" },
      { key: "Proposta n.º",    value: "209" },
    ],
    notes: ["Em negociação, alternativas infantis a apresentar pelo responsável."],
  },
  {
    id: 6,
    name: "Grupo Belaria",
    initials: "GB",
    phone: "Facebook @grupobelaria",
    account: "OF Eventos",
    channel: "facebook",
    label: "animacao",
    tab: "unassigned",
    timeAgo: "2 d",
    preview: "Qual é o valor para animação de uma inauguração?",
    messages: [
      { id: 1, sender: "client", text: "Qual é o valor para animação de uma inauguração?", time: "15:03" },
      { id: 2, sender: "agent", isAI: true, agentName: "Agente AI Solutions", text: "Depende da duração e do número de artistas. Para 2 horas com 2 artistas, 480,00 € mais IVA.", time: "15:03" },
    ],
    attributes: [
      { key: "Tipo de cliente", value: "Empresa" },
      { key: "Data do evento",  value: "18 set" },
      { key: "Serviços",        value: "Animação de inauguração" },
      { key: "Local",           value: "Loja, Gaia" },
    ],
    notes: ["Pedido padronizado, respondido pelo agente com valor de tabela."],
  },
  {
    id: 7,
    name: "Sandra Loureiro",
    initials: "SL",
    phone: "Facebook @sandra.loureiro",
    account: "Summerpolis",
    channel: "facebook",
    label: "campos_ferias",
    tab: "unassigned",
    timeAgo: "3 d",
    unread: 1,
    preview: "Ainda há vagas para o campo de férias de julho?",
    messages: [
      { id: 1, sender: "client", text: "Boa tarde, ainda há vagas no campo de férias de julho para dois miúdos de 8 e 10 anos?", time: "16:20" },
      { id: 2, sender: "agent", isAI: true, agentName: "Agente AI Solutions", text: "Boa tarde. Há vagas na semana de 7 a 11 de julho. A semana completa, com almoço, fica em 135,00 € por criança. Quer que reserve as duas vagas?", time: "16:21" },
    ],
    attributes: [
      { key: "Tipo de cliente", value: "Particular" },
      { key: "Data do evento",  value: "7 a 11 jul" },
      { key: "Serviços",        value: "Campo de férias, semana completa" },
      { key: "N.º de pessoas",  value: "2 crianças" },
      { key: "Local",           value: "Summerpolis" },
    ],
    notes: ["Pedido padronizado, respondido pelo agente com valor de tabela."],
  },
  {
    id: 8,
    name: "Escola Vale Verde",
    initials: "EV",
    phone: "+351 227 880 340",
    email: "direcao@valeverde.edu.pt",
    account: "OF Formação",
    channel: "email",
    label: "formacao",
    tab: "unassigned",
    timeAgo: "3 d",
    preview: "Formação de animadores para a equipa de 12 pessoas.",
    messages: [
      { id: 1, sender: "client", text: "Queríamos formação de animadores para a nossa equipa, somos 12 pessoas.", time: "10:41" },
      { id: 2, sender: "agent", isAI: true, agentName: "Agente AI Solutions", text: "Temos a formação de animadores em dois dias, com certificado. Para 12 participantes fica em 890,00 € mais IVA, nas nossas instalações. Prefere nas vossas?", time: "10:42" },
      { id: 3, sender: "client", text: "Nas nossas seria melhor. Podem indicar datas de outubro?", time: "10:58" },
    ],
    attributes: [
      { key: "Tipo de cliente", value: "Institucional" },
      { key: "Data do evento",  value: "outubro, a definir" },
      { key: "Serviços",        value: "Formação de animadores, 2 dias" },
      { key: "N.º de pessoas",  value: "12" },
      { key: "Local",           value: "Instalações do cliente" },
    ],
    notes: ["Aguarda datas de outubro confirmadas pela equipa."],
  },
  {
    id: 9,
    name: "Hugo Barreto",
    initials: "HB",
    phone: "+351 912 004 776",
    account: "OF Eventos",
    channel: "whatsapp",
    label: "duvida",
    tab: "unassigned",
    timeAgo: "4 d",
    preview: "Trabalham também fora do distrito do Porto?",
    messages: [
      { id: 1, sender: "client", text: "Bom dia, trabalham também fora do distrito do Porto?", time: "08:55" },
      { id: 2, sender: "agent", isAI: true, agentName: "Agente AI Solutions", text: "Bom dia. Trabalhamos em todo o país, com a deslocação incluída na proposta. Diga-me o local e a data que já lhe dou uma estimativa.", time: "08:55" },
    ],
    attributes: [
      { key: "Tipo de cliente", value: "Particular" },
      { key: "Serviços",        value: "Informação geral" },
    ],
    notes: ["Dúvida geral, respondida pelo agente sem passar pela equipa."],
  },
];

export function Unibox() {
  return (
    <SectionWrapper id="caixa-entrada" className="bg-deck-s1/40">
      <SectionHeading
        title="Tudo numa caixa de entrada só"
        subtitle="Email, Instagram, Facebook e WhatsApp deixam de ser quatro sítios diferentes. A equipa abre um separador e vê tudo, com o histórico de cada cliente."
      />

      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-deck-client/40 bg-deck-client/10 px-4 py-3 text-xs leading-relaxed text-deck-soft sm:text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-deck-client" />
        <span>
          Os valores que aparecem nestas conversas são inventados, só para ilustrar. O agente usa
          sempre a vossa tabela de preços real.
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-deck-border shadow-2xl shadow-black/40">
        <UniboxApp />
      </div>

      <p className="mt-6 text-center text-sm leading-relaxed text-deck-muted sm:text-base">
        Esta é uma simulação da interface, com pedidos parecidos com os vossos.
      </p>
      <p className="mt-2 text-center text-xs leading-relaxed text-deck-muted/70 sm:text-sm">
        A caixa centralizada faz parte da solução, com todos os canais tratados pelo agente.
      </p>
    </SectionWrapper>
  );
}

function UniboxApp() {
  const [selectedId, setSelectedId] = useState<number>(conversations[0]!.id);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [activeLabel, setActiveLabel] = useState<LabelKey | null>(null);
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [resolvedIds, setResolvedIds] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    return conversations
      .filter((c) => {
        if (activeTab !== "all" && c.tab !== activeTab) return false;
        if (activeChannel && c.channel !== activeChannel) return false;
        if (activeLabel && c.label !== activeLabel) return false;
        if (activeAccount && c.account !== activeAccount) return false;
        return true;
      })
      .sort((a, b) => labelPriority[a.label] - labelPriority[b.label]);
  }, [activeTab, activeChannel, activeLabel, activeAccount]);

  const counts = useMemo(() => {
    const base = conversations.filter((c) => {
      if (activeChannel && c.channel !== activeChannel) return false;
      if (activeLabel && c.label !== activeLabel) return false;
      if (activeAccount && c.account !== activeAccount) return false;
      return true;
    });
    return {
      mine: base.filter((c) => c.tab === "mine").length,
      unassigned: base.filter((c) => c.tab === "unassigned").length,
      all: base.length,
    };
  }, [activeChannel, activeLabel, activeAccount]);

  const selected =
    conversations.find((c) => c.id === selectedId) ?? filtered[0] ?? conversations[0]!;

  function handleResolve(id: number) {
    setResolvedIds((s) => new Set(s).add(id));
    const next = filtered.find((c) => c.id !== id);
    if (next) setSelectedId(next.id);
  }

  return (
    <div
      className="relative flex h-[680px] w-full overflow-hidden"
      style={{
        background: T.bg,
        color: T.text,
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Sidebar
        activeChannel={activeChannel}
        activeLabel={activeLabel}
        activeAccount={activeAccount}
        onChannelToggle={(c) => { setActiveChannel((cur) => (cur === c ? null : c)); setActiveLabel(null); }}
        onLabelToggle={(l) => { setActiveLabel((cur) => (cur === l ? null : l)); setActiveChannel(null); }}
        onAccountToggle={(a) => setActiveAccount((cur) => (cur === a ? null : a))}
        onClearFilters={() => { setActiveChannel(null); setActiveLabel(null); setActiveAccount(null); setActiveTab("all"); }}
        mineCount={conversations.filter((c) => c.tab === "mine").length}
      />

      <ConversationList
        conversations={filtered}
        selectedId={selected.id}
        onSelect={(c) => setSelectedId(c.id)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
        resolvedIds={resolvedIds}
      />

      <ConversationView
        key={selected.id}
        conversation={selected}
        onResolve={handleResolve}
        onToggleProfile={() => setProfileOpen((s) => !s)}
        profileOpen={profileOpen}
        resolved={resolvedIds.has(selected.id)}
      />

      {profileOpen && <ContactPanel conversation={selected} onClose={() => setProfileOpen(false)} />}
    </div>
  );
}

function Sidebar({
  activeChannel, activeLabel, activeAccount,
  onChannelToggle, onLabelToggle, onAccountToggle, onClearFilters, mineCount,
}: {
  activeChannel: Channel | null;
  activeLabel: LabelKey | null;
  activeAccount: string | null;
  onChannelToggle: (c: Channel) => void;
  onLabelToggle: (l: LabelKey) => void;
  onAccountToggle: (a: string) => void;
  onClearFilters: () => void;
  mineCount: number;
}) {
  const [convOpen, setConvOpen] = useState(true);

  return (
    <aside
      className="hidden h-full w-[224px] flex-shrink-0 flex-col lg:flex"
      style={{ borderRight: `1px solid ${T.border}`, background: "#0d0d14" }}
    >
      <div className="flex items-center gap-2 px-3 py-3" style={{ borderBottom: `1px solid ${T.border}` }}>
        <div
          className="flex h-8 flex-1 items-center justify-center rounded-md px-2 text-[12px] font-semibold tracking-wide"
          style={{ background: T.surface3, color: T.primary }}
        >
          OF Produções
        </div>
        <button className="rounded p-1" style={{ color: T.textMuted }} aria-label="menu da conta">
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs" style={{ background: T.accent, color: T.textMuted }}>
          <Search className="h-3.5 w-3.5" />
          <span>Pesquisar</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <NavBtn icon={InboxIcon} label="Caixa da equipa OF" onClick={onClearFilters} badge={mineCount} />

        <button onClick={() => setConvOpen((s) => !s)} className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm" style={{ color: T.textSoft }}>
          <MessageSquare className="h-4 w-4" />
          <span className="flex-1 text-left">Conversas</span>
          {convOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>

        {convOpen && (
          <div className="mt-0.5 space-y-0.5 pl-7">
            <button onClick={onClearFilters} className="block w-full rounded-md px-2 py-1 text-left text-[13px] font-medium" style={{ background: "rgba(0,212,170,0.15)", color: T.primary }}>
              Todas as conversas
            </button>
            <SubBtn icon={AtSign} label="Menções" />
            <SubBtn icon={AlertCircle} label="Sem resposta" />
          </div>
        )}

        <NavBtn icon={Folder} label="Pastas" />

        <SectionLabel>Áreas</SectionLabel>
        <div className="mt-1 space-y-0.5">
          {ACCOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => onAccountToggle(a)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors"
              style={{
                background: activeAccount === a ? "rgba(0,212,170,0.12)" : "transparent",
                color: activeAccount === a ? T.primary : T.textSoft,
              }}
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full" style={{ background: T.primary, color: T.primaryFg }}>
                <span className="text-[8px] font-bold">{a.slice(0, 1)}</span>
              </span>
              <span className="truncate">{a}</span>
            </button>
          ))}
        </div>

        <SectionLabel>Canais</SectionLabel>
        <div className="mt-1 space-y-0.5">
          {(["email", "instagram", "facebook", "whatsapp"] as Channel[]).map((c) => (
            <ChannelBtn key={c} channel={c} active={activeChannel === c} onClick={() => onChannelToggle(c)} />
          ))}
        </div>

        <SectionLabel>Etiquetas</SectionLabel>
        <div className="mt-1 space-y-0.5">
          {(Object.keys(labelMeta) as LabelKey[]).map((l) => (
            <button
              key={l}
              onClick={() => onLabelToggle(l)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors"
              style={{
                background: activeLabel === l ? "rgba(0,212,170,0.12)" : "transparent",
                color: activeLabel === l ? T.primary : T.textSoft,
              }}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: labelMeta[l].color }} />
              <span className="truncate">{labelMeta[l].name}</span>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={onClearFilters}
            className="w-full rounded-md px-2 py-1.5 text-[12px] font-medium"
            style={{ border: `1px dashed ${T.borderStrong}`, color: T.textMuted }}
          >
            Limpar filtros
          </button>
        </div>

        <div className="mt-6 space-y-0.5">
          {[
            { icon: Users, label: "Clientes" },
            { icon: BarChart3, label: "Relatórios" },
            { icon: Megaphone, label: "Campanhas" },
            { icon: HelpCircle, label: "Ajuda" },
            { icon: Settings, label: "Definições" },
          ].map((item) => <SubBtn key={item.label} icon={item.icon} label={item.label} />)}
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold" style={{ background: T.primary, color: T.primaryFg }}>OF</div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-medium">Equipa OF Produções</div>
          <div className="truncate text-[11px]" style={{ color: T.textMuted }}>geral@ofproducoes.com</div>
        </div>
      </div>
    </aside>
  );
}

function NavBtn({ icon: Icon, label, onClick, badge }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick?: () => void; badge?: number }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm" style={{ color: T.textSoft }}>
      <Icon className="h-4 w-4" />
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && (
        <span className="rounded px-1.5 text-[11px] font-medium" style={{ background: T.accent, color: T.textSoft }}>{badge}</span>
      )}
    </button>
  );
}

function SubBtn({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px]" style={{ color: T.textMuted }}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 px-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: T.textMuted }}>
      {children}
    </div>
  );
}

const channelLabels: Record<Channel, string> = {
  email: "Email",
  instagram: "Instagram",
  facebook: "Facebook Messenger",
  whatsapp: "WhatsApp",
};

function ChannelBtn({ channel, active, onClick }: { channel: Channel; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors"
      style={{
        background: active ? "rgba(0,212,170,0.12)" : "transparent",
        color: active ? T.primary : T.textSoft,
      }}
    >
      <ChannelIcon channel={channel} size={16} />
      <span>{channelLabels[channel]}</span>
    </button>
  );
}

function WhatsAppGlyph({ size = 10 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
    </svg>
  );
}

function ChannelIcon({ channel, size = 14 }: { channel: Channel; size?: number }) {
  const s = `${size}px`;
  if (channel === "whatsapp") {
    return (
      <span className="inline-flex items-center justify-center rounded-full text-white" style={{ width: s, height: s, background: T.whatsapp }} aria-label="WhatsApp">
        <WhatsAppGlyph size={Math.round(size * 0.7)} />
      </span>
    );
  }
  if (channel === "facebook") {
    return (
      <span className="inline-flex items-center justify-center rounded-full text-white" style={{ width: s, height: s, background: "#1877F2" }} aria-label="Facebook Messenger">
        <Facebook style={{ width: size * 0.7, height: size * 0.7 }} />
      </span>
    );
  }
  if (channel === "email") {
    return (
      <span className="inline-flex items-center justify-center rounded-md text-white" style={{ width: s, height: s, background: "#E8B84B" }} aria-label="Email">
        <Mail style={{ width: size * 0.7, height: size * 0.7, color: T.primaryFg }} />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center rounded-md text-white"
      style={{ width: s, height: s, background: "linear-gradient(135deg,#f9ce34,#ee2a7b 50%,#6228d7)" }} aria-label="Instagram">
      <Instagram style={{ width: size * 0.7, height: size * 0.7 }} />
    </span>
  );
}

function ConversationList({
  conversations: convs, selectedId, onSelect, activeTab, onTabChange, counts, resolvedIds,
}: {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (c: Conversation) => void;
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
  counts: { mine: number; unassigned: number; all: number };
  resolvedIds: Set<number>;
}) {
  const visible = convs.filter((c) => !resolvedIds.has(c.id));

  return (
    <div className="flex h-full w-[280px] flex-shrink-0 flex-col sm:w-[340px]" style={{ background: T.surface2, borderRight: `1px solid ${T.border}` }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-semibold">Conversas</h2>
          <button className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium" style={{ background: T.accent, color: T.textSoft }}>
            Todas <ChevronDown className="h-3 w-3" />
          </button>
        </div>
        <div className="flex items-center gap-1" style={{ color: T.textMuted }}>
          <button className="rounded p-1" aria-label="filtros"><SlidersHorizontal className="h-4 w-4" /></button>
          <button className="rounded p-1" aria-label="ordenar"><ArrowDownUp className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="flex items-center gap-1 px-3 py-2" style={{ borderBottom: `1px solid ${T.border}` }}>
        {([
          { key: "mine", label: "Minhas", count: counts.mine },
          { key: "unassigned", label: "Não atribuídas", count: counts.unassigned },
          { key: "all", label: "Todas", count: counts.all },
        ] as { key: Tab; label: string; count: number }[]).map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors"
              style={{ background: active ? T.accent : "transparent", color: active ? T.text : T.textMuted }}
            >
              {t.label}
              <span className="rounded px-1.5 text-[11px]" style={{ background: active ? "rgba(0,212,170,0.2)" : T.accent, color: active ? T.primary : T.textMuted }}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        {visible.length === 0 && (
          <div className="px-4 py-10 text-center text-sm" style={{ color: T.textMuted }}>Sem conversas para os filtros atuais.</div>
        )}
        {visible.map((c) => {
          const meta = labelMeta[c.label];
          const isSelected = c.id === selectedId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className="relative flex w-full items-start gap-3 px-3 py-3 text-left transition-colors"
              style={{ background: isSelected ? "rgba(0,212,170,0.08)" : "transparent", borderBottom: `1px solid ${T.border}` }}
            >
              {isSelected && <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: T.primary }} />}
              <div className="relative flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold" style={{ background: T.surface3, color: T.text }}>{c.initials}</div>
                <div className="absolute -bottom-0.5 -right-0.5 rounded-full" style={{ boxShadow: `0 0 0 2px ${T.surface2}` }}>
                  <ChannelIcon channel={c.channel} size={16} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[13.5px] font-semibold">{c.name}</span>
                  <span className="ml-auto flex-shrink-0 text-[11px]" style={{ color: T.textMuted }}>{c.timeAgo}</span>
                </div>
                <div className="mt-0.5 truncate text-[11px]" style={{ color: T.textMuted }}>via {c.account}</div>
                <p className="mt-0.5 truncate text-[12.5px]" style={{ color: T.textSoft }}>{c.preview}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10.5px] font-medium" style={{ background: hexAlpha(meta.color, 0.18), color: meta.color }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
                    {meta.name}
                  </span>
                  {c.unread && (
                    <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold" style={{ background: T.primary, color: T.primaryFg }}>{c.unread}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConversationView({
  conversation, onResolve, onToggleProfile, profileOpen, resolved,
}: {
  conversation: Conversation;
  onResolve: (id: number) => void;
  onToggleProfile: () => void;
  profileOpen: boolean;
  resolved: boolean;
}) {
  const [mode, setMode] = useState<"reply" | "note">("reply");
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation.id]);

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col" style={{ background: T.bg }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ background: T.surface1, borderBottom: `1px solid ${T.border}` }}>
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold" style={{ background: T.surface3, color: T.text }}>{conversation.initials}</div>
            <div className="absolute -bottom-0.5 -right-0.5 rounded-full" style={{ boxShadow: `0 0 0 2px ${T.surface1}` }}>
              <ChannelIcon channel={conversation.channel} size={16} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold">{conversation.name}</div>
            <div className="truncate text-[11.5px]" style={{ color: T.textMuted }}>
              via {channelLabels[conversation.channel]} · {conversation.account}
            </div>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          {resolved ? (
            <span className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold" style={{ background: "rgba(0,212,170,0.15)", color: T.primary }}>
              <CheckCircle2 className="h-4 w-4" /> Resolvido
            </span>
          ) : (
            <button onClick={() => onResolve(conversation.id)} className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-colors" style={{ background: T.primary, color: T.primaryFg }}>
              <CheckCircle2 className="h-4 w-4" /> Resolver
            </button>
          )}
          <button className="rounded-md p-1.5" style={{ color: T.textMuted }} aria-label="reatribuir"><ArrowLeftRight className="h-4 w-4" /></button>
          <button onClick={onToggleProfile} className="rounded-md p-1.5 transition-colors" style={{ background: profileOpen ? T.accent : "transparent", color: profileOpen ? T.text : T.textMuted }} aria-label="contacto">
            <UserCircle2 className="h-5 w-5" />
          </button>
          <button className="rounded-md p-1.5" style={{ color: T.textMuted }} aria-label="mais"><MoreVertical className="h-4 w-4" /></button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <div className="mb-4 flex justify-center">
          <span className="rounded-full px-3 py-1 text-[11px]" style={{ background: T.accent, color: T.textMuted }}>Hoje</span>
        </div>
        {conversation.messages.map((m) => <MessageBubble key={m.id} msg={m} />)}
      </div>

      <div style={{ background: mode === "note" ? "rgba(232,184,75,0.08)" : T.surface1, borderTop: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-1 px-4 pt-2">
          <button onClick={() => setMode("reply")} className="rounded-t-md px-3 py-1.5 text-[12.5px] font-medium transition-colors" style={{ background: mode === "reply" ? T.bg : "transparent", color: mode === "reply" ? T.text : T.textMuted }}>Responder</button>
          <button onClick={() => setMode("note")} className="rounded-t-md px-3 py-1.5 text-[12.5px] font-medium transition-colors" style={{ background: mode === "note" ? "rgba(232,184,75,0.2)" : "transparent", color: mode === "note" ? T.labelGold : T.textMuted }}>Nota privada</button>
        </div>
        <div className="px-4 py-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva uma resposta. Shift + Enter para nova linha."
            rows={3}
            className="w-full resize-none rounded-md px-3 py-2 text-[13.5px] focus:outline-none"
            style={{ background: mode === "note" ? "rgba(232,184,75,0.06)" : "transparent", border: `1px solid ${T.border}`, color: T.text }}
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1" style={{ color: T.textMuted }}>
              <button className="rounded p-1.5" aria-label="emoji"><Smile className="h-4 w-4" /></button>
              <button className="rounded p-1.5" aria-label="anexo"><Paperclip className="h-4 w-4" /></button>
              <button className="rounded p-1.5" aria-label="áudio"><Mic className="h-4 w-4" /></button>
              <button className="rounded p-1.5" aria-label="sugestão do agente"><Sparkles className="h-4 w-4" style={{ color: T.primary }} /></button>
            </div>
            <button disabled={!text.trim()} className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-opacity disabled:opacity-40" style={{ background: T.primary, color: T.primaryFg }}>
              <Send className="h-3.5 w-3.5" /> Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.sender === "system") {
    return (
      <div className="my-2 flex justify-center">
        <span className="rounded-full px-3 py-1 text-[11px]" style={{ background: T.accent, color: T.textMuted }}>{msg.text}</span>
      </div>
    );
  }
  const isAgent = msg.sender === "agent";
  return (
    <div className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[68%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed" style={{
        background: isAgent ? T.primary : T.surface3,
        color: isAgent ? T.primaryFg : T.text,
        borderBottomRightRadius: isAgent ? 4 : undefined,
        borderBottomLeftRadius: !isAgent ? 4 : undefined,
      }}>
        {isAgent && msg.isAI && (
          <div className="mb-1 flex items-center gap-1 text-[10.5px] font-semibold opacity-80">
            <Bot className="h-3 w-3" />
            {msg.agentName ?? "Agente AI Solutions"}
          </div>
        )}
        <p className="whitespace-pre-wrap">{renderText(msg.text)}</p>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10.5px]" style={{ color: isAgent ? "rgba(0,0,0,0.55)" : T.textMuted }}>
          <span>{msg.time}</span>
          {isAgent && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
}

function ContactPanel({ conversation, onClose }: { conversation: Conversation; onClose: () => void }) {
  return (
    <aside
      className="absolute right-0 top-0 z-20 flex h-full w-[300px] max-w-full flex-col shadow-2xl shadow-black/60"
      style={{ background: T.surface1, borderLeft: `1px solid ${T.border}` }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${T.border}` }}>
        <div className="text-[13px] font-semibold">Detalhes do contacto</div>
        <button onClick={onClose} className="rounded p-1" style={{ color: T.textMuted }} aria-label="fechar"><X className="h-4 w-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-4 py-5 text-center" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold" style={{ background: T.surface3, color: T.text }}>{conversation.initials}</div>
          <div className="mt-2 max-w-full break-words text-[14px] font-semibold">{conversation.name}</div>
          <div className="mt-2 flex max-w-full items-center gap-1.5 text-[12px]" style={{ color: T.textMuted }}>
            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="break-all">{conversation.phone}</span>
          </div>
          {conversation.email && (
            <div className="mt-1 flex max-w-full items-center gap-1.5 text-[12px]" style={{ color: T.textMuted }}>
              <Mail className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="break-all">{conversation.email}</span>
            </div>
          )}
        </div>
        <PanelSection title="Ações da conversa">
          <Field label="Área" value={conversation.account} avatar={conversation.account.slice(0, 2).toUpperCase()} />
          <Field label="Equipa" value="OF Produções" muted />
          <Field label="Prioridade" value="Normal" muted />
          <div className="mt-2">
            <div className="mb-1.5 text-[11px] font-medium" style={{ color: T.textMuted }}>Etiquetas</div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium" style={{ background: hexAlpha(labelMeta[conversation.label].color, 0.2), color: labelMeta[conversation.label].color }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: labelMeta[conversation.label].color }} />
                {labelMeta[conversation.label].name}
              </span>
              <button className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px]" style={{ border: `1px dashed ${T.borderStrong}`, color: T.textMuted }}>
                <Plus className="h-3 w-3" /> Adicionar
              </button>
            </div>
          </div>
        </PanelSection>
        <CollapsibleSection title="Macros" icon={Zap}>
          <button className="w-full rounded-md px-2 py-1.5 text-left text-[12px]" style={{ border: `1px dashed ${T.borderStrong}`, color: T.textMuted }}>+ Executar macro</button>
        </CollapsibleSection>
        <CollapsibleSection title="Mensagens agendadas" icon={CalendarClock}>
          <button className="flex w-full items-center gap-1 text-[12px]" style={{ color: T.primary }}>
            <Plus className="h-3 w-3" /> Agendar mensagem
          </button>
        </CollapsibleSection>
        <CollapsibleSection title="Atributos" icon={Tag}>
          {conversation.attributes && conversation.attributes.length > 0 ? (
            <div className="space-y-1.5">
              {conversation.attributes.map((a) => (
                <div key={a.key} className="flex items-center justify-between gap-3 text-[12px]">
                  <span style={{ color: T.textMuted }}>{a.key}</span>
                  <span className="text-right font-medium">{a.value}</span>
                </div>
              ))}
            </div>
          ) : <div className="text-[12px]" style={{ color: T.textMuted }}>Sem atributos</div>}
        </CollapsibleSection>
        <CollapsibleSection title="Notas internas" icon={StickyNote}>
          {conversation.notes && conversation.notes.length > 0 ? (
            <ul className="space-y-1.5 text-[12px]" style={{ color: T.textSoft }}>
              {conversation.notes.map((n, i) => <li key={i} className="rounded px-2 py-1.5" style={{ background: T.accent }}>{n}</li>)}
            </ul>
          ) : <div className="text-[12px]" style={{ color: T.textMuted }}>Sem notas</div>}
        </CollapsibleSection>
        <CollapsibleSection title="Conversas anteriores" icon={History}>
          <div className="text-[12px]" style={{ color: T.textMuted }}>Sem registos.</div>
        </CollapsibleSection>
      </div>
    </aside>
  );
}

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
      <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: T.textMuted }}>{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CollapsibleSection({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <details open className="group px-4 py-3" style={{ borderBottom: `1px solid ${T.border}` }}>
      <summary className="flex cursor-pointer items-center gap-2 text-[12px] font-semibold">
        <Icon className="h-3.5 w-3.5" />
        {title}
        <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-2.5">{children}</div>
    </details>
  );
}

function Field({ label, value, muted, avatar }: { label: string; value: string; muted?: boolean; avatar?: string }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium" style={{ color: T.textMuted }}>{label}</div>
      <button className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[12px]" style={{ border: `1px solid ${T.border}`, background: T.accent }}>
        <span className="flex items-center gap-1.5">
          {avatar && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold" style={{ background: T.primary, color: T.primaryFg }}>{avatar}</span>
          )}
          <span style={{ color: muted ? T.textMuted : T.text }}>{value}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5" style={{ color: T.textMuted }} />
      </button>
    </div>
  );
}

function hexAlpha(hex: string, alpha: number) {
  const m = hex.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return hex;
  const int = parseInt(m[1]!, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
