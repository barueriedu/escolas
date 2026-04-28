// Calendar data for 2026 - EMEF Barueri (Revisado e Completo)
const calendarData = {
  year: 2026,
  institution: "EMEF Barueri",
  months: [
    {
      name: "Janeiro",
      days: Array.from({ length: 31 }, (_, i) => ({
        date: i + 1,
        events: [{ type: "ferias", text: "Férias / Recesso Docente" }]
      }))
    },
    {
      name: "Fevereiro",
      days: [
        { date: 1, events: [{ type: "ferias", text: "Férias / Recesso Docente" }] },
        { date: 4, events: [{ type: "planejamento", text: "Semana Pedagógica / Planejamento" }] },
        { date: 5, events: [{ type: "planejamento", text: "Semana Pedagógica / Planejamento" }] },
        { date: 6, events: [{ type: "planejamento", text: "Semana Pedagógica / Planejamento" }] },
        { date: 9, events: [{ type: "inicio_aulas", text: "Início das Aulas" }] },
        { date: 16, events: [{ type: "recesso", text: "Recesso de Carnaval" }] },
        { date: 17, events: [{ type: "feriado", text: "Carnaval" }] },
        { date: 18, events: [{ type: "ponto_facultativo", text: "Quarta-feira de Cinzas (Atendimento ao Decreto 10.264/2025)" }] }
      ]
    },
    {
      name: "Março",
      days: [
        { date: 26, events: [{ type: "feriado", text: "Aniversário de Barueri" }] },
        { date: 27, events: [{ type: "ponto_facultativo", text: "Ponto Facultativo" }] }
      ]
    },
    {
      name: "Abril",
      days: [
        { date: 2, events: [{ type: "reuniao_pais", text: "Reunião de Pais" }] },
        { date: 3, events: [{ type: "feriado", text: "Sexta-feira Santa" }] },
        { date: 20, events: [{ type: "ponto_facultativo", text: "Ponto Facultativo" }] },
        { date: 21, events: [{ type: "feriado", text: "Tiradentes" }] },
        { date: 27, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 28, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 29, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 30, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] }
      ]
    },
    {
      name: "Maio",
      days: [
        { date: 1, events: [{ type: "feriado", text: "Dia do Trabalho" }] },
        { date: 4, events: [{ type: "inicio_bimestre", text: "Início do 2º Bimestre" }] },
        { date: 11, events: [{ type: "conselho", text: "Conselho de Classe com Revezamento" }] },
        { date: 12, events: [{ type: "conselho", text: "Conselho de Classe com Revezamento" }] }
      ]
    },
    {
      name: "Junho",
      days: [
        { date: 4, events: [{ type: "feriado", text: "Corpus Christi" }] },
        { date: 5, events: [{ type: "ponto_facultativo", text: "Ponto Facultativo" }] },
        { date: 20, events: [{ type: "festa_junina", text: "Evento: Festa Junina" }] },
        { date: 24, events: [{ type: "conselho", text: "Conselho de Classe com Revezamento" }] },
        { date: 25, events: [{ type: "conselho", text: "Conselho de Classe com Revezamento" }] },
        { date: 26, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 29, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 30, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] }
      ]
    },
    {
      name: "Julho",
      days: [
        { date: 1, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 8, events: [{ type: "termino_semestre", text: "Encerramento do Semestre para Alunos" }] },
        { date: 9, events: [{ type: "feriado", text: "Revolução Constitucionalista" }] },
        { date: 10, events: [{ type: "ponto_facultativo", text: "Ponto Facultativo / Recesso" }] },
        ...Array.from({ length: 14 }, (_, i) => ({
          date: i + 13,
          events: [{ type: "recesso", text: "Recesso Escolar" }]
        })),
        { date: 27, events: [{ type: "inicio_bimestre", text: "Início do 3º Bimestre" }] }
      ]
    },
    {
      name: "Agosto",
      days: [
        { date: 3, events: [{ type: "reuniao_pais", text: "Reunião de Pais" }] },
        { date: 28, events: [{ type: "evento_civico", text: "Evento Cívico Militar" }] }
      ]
    },
    {
      name: "Setembro",
      days: [
        { date: 7, events: [{ type: "feriado", text: "Independência do Brasil" }] },
        { date: 23, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 24, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 25, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 28, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 29, events: [{ type: "conselho", text: "Conselho de Classe com Revezamento" }] },
        { date: 30, events: [{ type: "conselho", text: "Conselho de Classe com Revezamento" }] }
      ]
    },
    {
      name: "Outubro",
      days: [
        { date: 1, events: [{ type: "inicio_bimestre", text: "Início do 4º Bimestre" }] },
        { date: 12, events: [{ type: "feriado", text: "Nossa Senhora Aparecida" }] },
        { date: 13, events: [{ type: "recesso", text: "Ponto Facultativo / Recesso" }] },
        { date: 15, events: [{ type: "feriado", text: "Dia do Professor" }] },
        { date: 16, events: [{ type: "recesso", text: "Ponto Facultativo / Recesso" }] },
        { date: 26, events: [{ type: "feriado", text: "Dia do Funcionário Público (Transferido)" }] }
      ]
    },
    {
      name: "Novembro",
      days: [
        { date: 2, events: [{ type: "feriado", text: "Finados" }] },
        { date: 15, events: [{ type: "feriado", text: "Proclamação da República" }] },
        { date: 20, events: [{ type: "feriado", text: "Consciência Negra" }] }
      ]
    },
    {
      name: "Dezembro",
      days: [
        { date: 1, events: [{ type: "reuniao_pais", text: "Reunião de Pais" }] },
        { date: 7, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 8, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 9, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 10, events: [{ type: "avaliacoes", text: "Período de Avaliações Bimestrais" }] },
        { date: 11, events: [{ type: "conselho", text: "Conselho de Classe com Revezamento" }] },
        { date: 14, events: [{ type: "conselho", text: "Conselho de Classe com Revezamento" }] },
        { date: 15, events: [{ type: "fechamento", text: "Fechamento de Documentação Pedagógica" }] },
        { date: 16, events: [{ type: "fechamento", text: "Fechamento de Documentação Pedagógica" }] },
        { date: 17, events: [{ type: "fechamento", text: "Fechamento de Documentação Pedagógica" }] },
        { date: 18, events: [{ type: "formatura", text: "Formatura Ensino Fundamental e Encerramento de Aulas" }] },
        { date: 25, events: [{ type: "feriado", text: "Natal" }] },
        ...Array.from({ length: 10 }, (_, i) => {
           const d = i + 21;
           return d !== 25 ? { date: d, events: [{ type: "ferias", text: "Férias / Recesso" }] } : null;
        }).filter(Boolean)
      ]
    }
  ]
};

export default calendarData;