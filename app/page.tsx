"use client";

import { useMemo, useState } from "react";

const STEPS = [
  ["01", "Identificação", "Ciclo e responsável"],
  ["02", "Plano de cuidado", "Tratamento e prioridades"],
  ["03", "Agenda de 6 meses", "Exames e ações"],
  ["04", "Revisão", "Conferência médica"],
  ["05", "PDF", "Documento do paciente"],
] as const;

const STEP_TITLES = ["Novo plano", "Plano de cuidado", "Agenda de 6 meses", "Revisão médica", "Documento do paciente"];
const CONDUCTS = ["Manter", "Iniciar", "Ajustar", "Substituir", "Suspender", "Em decisão"];
const GOALS = [
  "Manter o controle do quadro",
  "Monitorar segurança do tratamento",
  "Avaliar resposta ao tratamento",
  "Controlar sintomas",
  "Organizar vacinação",
  "Planejamento familiar",
  "Manter atividade física",
  "Otimizar reabilitação",
];
const SYMPTOMS = ["Fadiga", "Dor", "Sono", "Mobilidade", "Cognição", "Humor"];

type PlanAction = {
  id: number;
  category: string;
  title: string;
  purpose: string;
  month: string;
  owner: string;
  status: string;
};

const INITIAL_ACTIONS: PlanAction[] = [];

function displayDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(`${value}T12:00:00`))
    .replaceAll(" de ", " ");
}

function addSixMonths(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  date.setMonth(date.getMonth() + 6);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    .format(date)
    .replaceAll(" de ", " ");
}

function SectionHeading({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="section-heading">
      <span className="section-index">{number}</span>
      <div><h2>{title}</h2><p>{description}</p></div>
    </div>
  );
}

function FormNavigation({ step, onBack, onNext, nextLabel, disabled = false }: {
  step: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="actions-row">
      <button className="button-secondary" type="button" onClick={onBack}>{step === 1 ? "Cancelar" : "Voltar"}</button>
      <button className="button-primary" type="button" onClick={onNext} disabled={disabled}>
        {nextLabel}<span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [initials, setInitials] = useState("");
  const [consultationDate, setConsultationDate] = useState("");
  const [doctor, setDoctor] = useState("");
  const [treatment, setTreatment] = useState("");
  const [regimen, setRegimen] = useState("");
  const [conduct, setConduct] = useState("Manter");
  const [summary, setSummary] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [actions, setActions] = useState<PlanAction[]>(INITIAL_ACTIONS);
  const [showNewAction, setShowNewAction] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState("");
  const [newActionMonth, setNewActionMonth] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [approved, setApproved] = useState(false);

  const cycleEnd = useMemo(() => addSixMonths(consultationDate), [consultationDate]);
  const cleanInitials = initials.replace(/[^A-Z]/g, "") || "NNI";
  const planCode = `NNI-${consultationDate.slice(0, 7).replace("-", "")}-${cleanInitials}`;

  function toggleValue(value: string, values: string[], setter: (next: string[]) => void, limit?: number) {
    if (values.includes(value)) setter(values.filter((item) => item !== value));
    else if (!limit || values.length < limit) setter([...values, value]);
  }

  function addAction() {
    if (!newActionTitle.trim()) return;
    setActions([...actions, {
      id: Date.now(),
      category: "Outro",
      title: newActionTitle.trim(),
      purpose: "Completar o planejamento deste ciclo",
      month: newActionMonth,
      owner: "Paciente",
      status: "Precisa organizar",
    }]);
    setNewActionTitle("");
    setShowNewAction(false);
  }

  function goTo(next: number) {
    setStep(Math.min(5, Math.max(1, next)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const miniPreview = (
    <aside className="preview-card" aria-label="Resumo do documento em construção">
      <div className="preview-topline"><span>Prévia estrutural</span><span className="preview-tag">Em construção</span></div>
      <div className="preview-paper">
        <img src="nni-logo.png" alt="" />
        <span className="preview-kicker">Seu plano de cuidado</span>
        <h3>Próximos 6 meses</h3>
        <div className="preview-identity">
          <div><small>Paciente</small><strong>{initials || "—"}</strong></div>
          <div><small>Período</small><strong>{consultationDate ? `${displayDate(consultationDate)} — ${cycleEnd}` : "—"}</strong></div>
        </div>
        {step === 1 ? (
          <div className="preview-placeholder"><span /><span /><span /></div>
        ) : (
          <div className="mini-plan-content">
            <small>Tratamento atual</small><strong>{treatment || "A definir"}</strong>
            <small>Prioridades</small><strong>{selectedGoals.length} objetivos selecionados</strong>
            <small>Próxima etapa</small><strong>{actions[0]?.title || "A definir"}</strong>
          </div>
        )}
        <div className="preview-footer"><span>NNI</span><span>Plano terapêutico de 6 meses</span></div>
      </div>
      <p className="preview-caption">A prévia completa aparece na revisão. Nenhum dado é salvo durante o preenchimento.</p>
    </aside>
  );

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Etapas do plano terapêutico">
        <div className="brand-panel">
          <img className="nni-logo" src="nni-logo.png" alt="Núcleo de Neuroimunologia" />
          <div className="product-label"><span>Uso interno</span><strong>Gerador de Plano Terapêutico</strong></div>
        </div>
        <nav className="steps">
          {STEPS.map(([number, title, caption], index) => {
            const position = index + 1;
            return (
              <button
                className={`step ${step === position ? "step-active" : ""} ${step > position ? "step-complete" : ""}`}
                key={number}
                type="button"
                onClick={() => goTo(position)}
                aria-current={step === position ? "step" : undefined}
              >
                <span className="step-number">{step > position ? "✓" : number}</span>
                <span><strong>{title}</strong><small>{caption}</small></span>
              </button>
            );
          })}
        </nav>
        <div className="privacy-note"><span className="privacy-mark">✓</span><div><strong>Processamento local</strong><p>As informações desta sessão não serão armazenadas.</p></div></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><span className="eyebrow">Plano terapêutico de 6 meses</span><h1>{STEP_TITLES[step - 1]}</h1></div>
          <div className="session-status"><span className="status-dot" />Sessão temporária</div>
        </header>

        <div className={`content-grid ${step === 5 ? "content-grid-document" : ""}`}>
          <section className="form-column">
            {step === 1 && (
              <>
                <SectionHeading number="01" title="Identificação do ciclo" description="Somente os dados mínimos necessários para reconhecer o plano." />
                <div className="privacy-banner"><div className="banner-icon">i</div><div><strong>Não utilize nome completo ou número de prontuário.</strong><p>O paciente será identificado apenas pelas iniciais e por um código gerado no PDF.</p></div></div>
                <div className="form-card">
                  <div className="field-grid">
                    <label className="field"><span>Iniciais do paciente</span><input value={initials} maxLength={5} onChange={(event) => setInitials(event.target.value.toUpperCase())} /><small>Até 5 caracteres. Exemplo: D.Q.</small></label>
                    <label className="field"><span>Data da consulta</span><input type="date" value={consultationDate} onChange={(event) => setConsultationDate(event.target.value)} /><small>Define automaticamente o ciclo de seis meses.</small></label>
                    <label className="field field-wide"><span>Médico responsável</span><input value={doctor} onChange={(event) => setDoctor(event.target.value)} placeholder="Nome e especialidade" /><small>O registro profissional será associado na versão de produção.</small></label>
                  </div>
                  <div className="cycle-summary"><span className="cycle-symbol">↗</span><div><span>Período calculado</span><strong>{displayDate(consultationDate)} → {cycleEnd || "—"}</strong></div><span className="cycle-pill">6 meses</span></div>
                </div>
                <FormNavigation step={step} onBack={() => undefined} onNext={() => goTo(2)} nextLabel="Continuar para o plano de cuidado" />
              </>
            )}

            {step === 2 && (
              <>
                <SectionHeading number="02" title="Plano de cuidado" description="Registre a estratégia atual e escolha somente as prioridades que orientarão este ciclo." />
                <div className="form-card stack-card">
                  <div className="card-title"><div><span className="card-kicker">Tratamento atual</span><h3>Estratégia terapêutica</h3></div><span className="required-chip">Obrigatório</span></div>
                  <div className="field-grid">
                    <label className="field"><span>Tratamento principal</span><input value={treatment} onChange={(event) => setTreatment(event.target.value)} /></label>
                    <label className="field"><span>Rotina ou frequência</span><input value={regimen} onChange={(event) => setRegimen(event.target.value)} /></label>
                  </div>
                  <div className="subsection"><span className="field-label">Conduta neste ciclo</span><div className="choice-row">{CONDUCTS.map((item) => <button key={item} type="button" className={`choice-pill ${conduct === item ? "selected" : ""}`} onClick={() => setConduct(item)}>{item}</button>)}</div></div>
                  <label className="field"><span>Resumo do plano em uma frase</span><textarea value={summary} maxLength={220} onChange={(event) => setSummary(event.target.value)} /><small>{summary.length}/220 caracteres</small></label>
                </div>

                <div className="form-card stack-card">
                  <div className="card-title"><div><span className="card-kicker">Próximos 6 meses</span><h3>Prioridades do ciclo</h3></div><span className="count-chip">{selectedGoals.length}/4</span></div>
                  <p className="helper-copy">Escolha até quatro prioridades. Elas aparecerão em destaque no documento do paciente.</p>
                  <div className="goal-grid">{GOALS.map((goal) => <button key={goal} type="button" className={`goal-option ${selectedGoals.includes(goal) ? "selected" : ""}`} onClick={() => toggleValue(goal, selectedGoals, setSelectedGoals, 4)}><span className="goal-check">{selectedGoals.includes(goal) ? "✓" : "+"}</span>{goal}</button>)}</div>
                  <div className="subsection bordered"><span className="field-label">Sintomas a acompanhar</span><div className="choice-row">{SYMPTOMS.map((symptom) => <button key={symptom} type="button" className={`choice-pill ${selectedSymptoms.includes(symptom) ? "selected" : ""}`} onClick={() => toggleValue(symptom, selectedSymptoms, setSelectedSymptoms)}>{symptom}</button>)}</div></div>
                </div>
                <FormNavigation step={step} onBack={() => goTo(1)} onNext={() => goTo(3)} nextLabel="Organizar agenda de 6 meses" />
              </>
            )}

            {step === 3 && (
              <>
                <SectionHeading number="03" title="Agenda dos próximos 6 meses" description="Cada ação precisa responder o que será feito, quando e quem dará o próximo passo." />
                <div className="timeline-toolbar"><div><strong>{actions.length} ações planejadas</strong><span>Organizadas na ordem em que aparecerão para o paciente</span></div><button type="button" className="button-compact" onClick={() => setShowNewAction(!showNewAction)}>+ Adicionar ação</button></div>
                {showNewAction && (
                  <div className="new-action-card">
                    <label className="field"><span>O que será feito?</span><input autoFocus value={newActionTitle} onChange={(event) => setNewActionTitle(event.target.value)} placeholder="Ex.: Avaliação com fisioterapia" /></label>
                    <label className="field"><span>Quando?</span><input value={newActionMonth} onChange={(event) => setNewActionMonth(event.target.value)} /></label>
                    <div className="inline-actions"><button type="button" className="text-button" onClick={() => setShowNewAction(false)}>Cancelar</button><button type="button" className="button-compact" onClick={addAction}>Adicionar</button></div>
                  </div>
                )}
                <div className="timeline-list">
                  {actions.map((action, index) => (
                    <article className="timeline-item" key={action.id}>
                      <div className="timeline-axis"><span>{index + 1}</span></div>
                      <div className="timeline-body">
                        <div className="timeline-meta"><span className="category-chip">{action.category}</span><strong>{action.month}</strong></div>
                        <h3>{action.title}</h3><p>{action.purpose}</p>
                        <div className="timeline-details"><span>Próximo movimento: <strong>{action.owner}</strong></span><span>{action.status}</span></div>
                      </div>
                      <button className="more-button" type="button" aria-label={`Editar ${action.title}`}>•••</button>
                    </article>
                  ))}
                </div>
                <div className="return-card">
                  <div className="return-icon">↻</div>
                  <div><span className="card-kicker">Próximo ponto de decisão</span><h3>Consulta de retorno</h3><p>Revisar exames, segurança do tratamento e evolução dos objetivos selecionados.</p></div>
                  <label className="compact-date"><span>Data prevista</span><input type="date" value={returnDate} onChange={(event) => setReturnDate(event.target.value)} /></label>
                </div>
                <FormNavigation step={step} onBack={() => goTo(2)} onNext={() => goTo(4)} nextLabel="Revisar o plano" />
              </>
            )}

            {step === 4 && (
              <>
                <SectionHeading number="04" title="Revisão médica" description="Confira a lógica do plano antes de preparar o documento para o paciente." />
                <div className="review-grid">
                  <div className="review-checklist form-card">
                    <div className="card-title"><div><span className="card-kicker">Validação</span><h3>O plano está completo?</h3></div><span className="review-score">6/6</span></div>
                    {[
                      ["Identificação mínima", `${initials} · ${planCode}`],
                      ["Tratamento definido", `${conduct} ${treatment}`],
                      ["Prioridades selecionadas", `${selectedGoals.length} objetivos`],
                      ["Agenda estruturada", `${actions.length} ações`],
                      ["Retorno previsto", displayDate(returnDate)],
                      ["Privacidade", "Sem nome completo ou prontuário"],
                    ].map(([label, value]) => <div className="review-line" key={label}><span className="review-check">✓</span><div><strong>{label}</strong><small>{value}</small></div></div>)}
                  </div>
                  <div className="review-summary form-card">
                    <span className="card-kicker">Resumo gerado</span><h3>{summary}</h3>
                    <dl><div><dt>Tratamento</dt><dd>{treatment} · {regimen}</dd></div><div><dt>Principal próxima ação</dt><dd>{actions[0]?.title}</dd></div><div><dt>Retorno</dt><dd>{displayDate(returnDate)}</dd></div></dl>
                  </div>
                </div>
                <label className={`approval-box ${approved ? "approved" : ""}`}><input type="checkbox" checked={approved} onChange={(event) => setApproved(event.target.checked)} /><span className="approval-check">{approved ? "✓" : ""}</span><span><strong>Revisei e aprovo as informações deste plano</strong><small>A versão final será apresentada antes da geração do PDF.</small></span></label>
                <FormNavigation step={step} onBack={() => goTo(3)} onNext={() => goTo(5)} nextLabel="Visualizar documento" disabled={!approved} />
              </>
            )}

            {step === 5 && (
              <>
                <div className="document-toolbar"><div><span className="eyebrow">Prévia final</span><h2>Documento do paciente</h2><p>Revise as duas páginas antes de gerar o PDF.</p></div><div><button className="button-secondary" type="button" onClick={() => goTo(4)}>Voltar à revisão</button><button className="button-primary" type="button" onClick={() => window.print()}>Gerar PDF <span>↓</span></button></div></div>
                <div className="document-preview">
                  <article className="a4-page page-one">
                    <div className="doc-header"><img src="nni-logo.png" alt="Núcleo de Neuroimunologia" /><div><span>Plano terapêutico</span><strong>Próximos 6 meses</strong></div></div>
                    <div className="doc-hero"><span>Seu plano de cuidado</span><h2>Clareza sobre o que acontece agora e o que vem depois.</h2></div>
                    <div className="doc-identity"><div><small>Paciente</small><strong>{initials}</strong></div><div><small>Período</small><strong>{displayDate(consultationDate)} — {cycleEnd}</strong></div><div><small>Código</small><strong>{planCode}</strong></div></div>
                    <section className="doc-section"><span className="doc-section-label">Onde estamos agora</span><p className="doc-lead">{summary}</p></section>
                    <section className="doc-treatment"><div><small>Seu tratamento hoje</small><h3>{treatment}</h3><p>{regimen}</p></div><span className="doc-conduct">{conduct}</span></section>
                    <section className="doc-section"><span className="doc-section-label">Prioridades deste ciclo</span><div className="doc-goal-grid">{selectedGoals.map((goal, index) => <div key={goal}><span>0{index + 1}</span><strong>{goal}</strong></div>)}</div></section>
                    <div className="doc-highlight-grid"><div className="doc-next"><small>Seu próximo passo</small><strong>{actions[0]?.title}</strong><span>{actions[0]?.month}</span></div><div className="doc-return"><small>Próxima consulta</small><strong>{displayDate(returnDate)}</strong><span>Revisar exames e evolução</span></div></div>
                    <div className="doc-footer"><span>Núcleo de Neuroimunologia</span><span>1 / 2</span></div>
                  </article>

                  <article className="a4-page page-two">
                    <div className="doc-header compact"><img src="nni-logo.png" alt="" /><div><span>{initials}</span><strong>Roteiro do seu cuidado</strong></div></div>
                    <section className="doc-section"><span className="doc-section-label">Seu caminho nos próximos 6 meses</span><div className="doc-timeline">{actions.map((action, index) => <div className="doc-timeline-item" key={action.id}><span className="doc-timeline-number">{index + 1}</span><div><small>{action.month} · {action.category}</small><strong>{action.title}</strong><p>{action.purpose}</p><em>{action.owner} · {action.status}</em></div></div>)}<div className="doc-timeline-item return"><span className="doc-timeline-number">✓</span><div><small>{displayDate(returnDate)} · Consulta NNI</small><strong>Reavaliar e decidir os próximos passos</strong><p>Revisar exames, tratamento e evolução dos sintomas acompanhados.</p></div></div></div></section>
                    <div className="doc-two-columns"><section><span className="doc-section-label">Cuidados durante todo o período</span><ul><li>Manter o tratamento conforme prescrito.</li><li>Registrar mudanças relevantes nos sintomas.</li>{selectedGoals.includes("Manter atividade física") && <li>Manter atividade física adaptada às orientações recebidas.</li>}{selectedGoals.includes("Organizar vacinação") && <li>Atualizar vacinação conforme orientação individual.</li>}{selectedGoals.includes("Planejamento familiar") && <li>Conversar com a equipe antes de decisões reprodutivas.</li>}</ul></section><section className="doc-safety"><span className="doc-section-label">Quando falar com a equipe</span><p>Entre em contato se perceber sintomas novos, piora persistente ou dificuldade para manter o tratamento.</p><small>Em situações graves ou de rápida progressão, procure um serviço de urgência.</small></section></div>
                    <div className="doc-signature"><div><span>Plano revisado por</span><strong>{doctor}</strong></div><div><span>Emitido em</span><strong>{displayDate(consultationDate)}</strong></div></div>
                    <div className="doc-footer"><span>Núcleo de Neuroimunologia</span><span>2 / 2</span></div>
                  </article>
                </div>
                <p className="prototype-note">Neste protótipo, “Gerar PDF” abre a impressão local do navegador. A versão final fará o download direto do arquivo.</p>
              </>
            )}
          </section>
          {step < 5 && miniPreview}
        </div>
      </section>
    </main>
  );
}
