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
        { date: 7, events: [{ type: "Reunião de Pais", text: "Semana Pedagógica / Planejamento" }] },
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

// Function to get number of days in a month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Function to create a calendar month
function createMonthCalendar(monthData, monthIndex) {
  const monthDiv = document.createElement("div");
  monthDiv.className = "calendar-month bg-white p-3 rounded-lg shadow-md mb-4";

  const monthHeader = document.createElement("h3");
  monthHeader.textContent = monthData.name;
  monthHeader.className = "text-lg font-bold mb-3 text-center";
  monthDiv.appendChild(monthHeader);

  const daysGrid = document.createElement("div");
  daysGrid.className = "grid grid-cols-7 gap-0.5 text-center text-xs";

  // Add weekday headers
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  weekdays.forEach((day) => {
    const dayHeader = document.createElement("div");
    dayHeader.textContent = day;
    dayHeader.className = "font-bold p-1 bg-gray-200 text-xs";
    daysGrid.appendChild(dayHeader);
  });

  // Descobrir o primeiro dia da semana do mês
  const firstDate = new Date(2026, monthIndex, 1);
  const firstWeekDay = firstDate.getDay(); // 0 = domingo, 1 = segunda, ...

  // Adicionar células vazias antes do dia 1
  for (let i = 0; i < firstWeekDay; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "p-1";
    daysGrid.appendChild(emptyDiv);
  }

  // Get events for this month
  const eventsMap = {};
  monthData.days.forEach(day => {
    eventsMap[day.date] = day.events;
  });

  // Add days
  const daysInMonth = getDaysInMonth(2026, monthIndex);
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = dayNum;
    dayDiv.className = "p-1 border min-h-[35px] relative text-xs";

    const date = new Date(2026, monthIndex, dayNum);
    const weekDay = date.getDay();

    // Dias de Conselho de Classe
    if (
      (monthData.name === "Maio" && (dayNum === 11 || dayNum === 12)) ||
      (monthData.name === "Junho" && (dayNum === 24 || dayNum === 25)) ||
      (monthData.name === "Setembro" && (dayNum === 29 || dayNum === 30)) ||
      (monthData.name === "Dezembro" && (dayNum === 11 || dayNum === 14))
    ) {
      dayDiv.style.backgroundColor = "#8ff5aa";
      dayDiv.title = "Conselho de Classe";
    }
    // Aplicar cores baseadas nos eventos
    const dayEvents = eventsMap[dayNum] || [];
    if (dayEvents.length > 0) {
      const event = dayEvents[0];

      switch (event.type) {
        case "feriado":
          dayDiv.style.backgroundColor = "#ff0000";
          dayDiv.style.color = "#fff";
          break;
        case "ferias":
          dayDiv.style.backgroundColor = "#ff7878";
          break;
        case "planejamento":
          dayDiv.style.backgroundColor = "#FFD700";
          break;
        case "reuniao_pais":
          dayDiv.style.backgroundColor = "#7955FA";
          dayDiv.style.color = "#fff";
          break;
        case "inicio_aulas":
          dayDiv.style.backgroundColor = "#ffffff";
          dayDiv.style.border = "2px solid #000";
          break;
        case "recesso":
          dayDiv.style.backgroundColor = "#ff7878";
          break;
        case "ponto_facultativo":
          dayDiv.style.backgroundColor = "#ff00ff";
          break;
        case "avaliacoes":
          dayDiv.style.backgroundColor = "#FFD700";
          break;
        case "inicio_bimestre":
          dayDiv.style.backgroundColor = "#ffffff";
          dayDiv.style.border = "2px solid #000";
          break;
        case "conselho":
          dayDiv.style.backgroundColor = "#8ff5aa";
          break;
        case "festa_junina":
          dayDiv.style.backgroundColor = "#edf574";
          break;
        case "termino_semestre":
          dayDiv.style.backgroundColor = "#ffffff";
          dayDiv.style.border = "2px solid #000";
          break;
        case "evento_civico":
          dayDiv.style.backgroundColor = "#edf574";
          break;
        case "fechamento":
          dayDiv.style.backgroundColor = "#FFD700";
          break;
        case "formatura":
          dayDiv.style.backgroundColor = "#ffffff";
          dayDiv.style.border = "2px solid #000";
          break;
        default:
          // Dias letivos normais
          dayDiv.style.backgroundColor = "#87CEEB";
      }
      // Adicionar tooltip com informações do evento
      dayDiv.title = event.text;
    } else {
      // Sábados e domingos
      if (weekDay === 0 || weekDay === 6) {
        dayDiv.style.backgroundColor = "#ff0000";
        dayDiv.style.color = "#fff";
      } else {
        // Dias letivos normais
        dayDiv.style.backgroundColor = "#87CEEB";
      }
    }

    daysGrid.appendChild(dayDiv);
  }

  monthDiv.appendChild(daysGrid);
  return monthDiv;
}

// Initialize calendar
function initializeCalendar() {
  const container = document.getElementById("calendarContainer");

  // Remove meses antigos se houver
  container.querySelectorAll(".calendar-month").forEach((el) => el.remove());

  // Create calendar for each month
  calendarData.months.forEach((month, idx) => {
    const monthCalendar = createMonthCalendar(month, idx);
    monthCalendar.dataset.monthIndex = idx;
    container.appendChild(monthCalendar);
  });

  // Clique para destacar mês e mostrar eventos
  container.querySelectorAll(".calendar-month").forEach((monthDiv, idx) => {
    monthDiv.style.display = "";
    let anyInRange = false;
    let monthEvents = [];
    monthDiv.addEventListener("click", function (e) {
      // Remove painel de total de dias do bimestre, se existir
      const infoPanel = document.getElementById("bimestreInfoPanel");
      if (infoPanel) infoPanel.remove();
      // Remove todas as classes de destaque/desfoque de todos os meses
      container.querySelectorAll(".calendar-month").forEach((el) => {
        el.classList.remove("selected");
        el.classList.remove("faded");
        // Remove legendas de eventos se houver
        const legend = el.querySelector(".month-events-legend");
        if (legend) legend.remove();
        // Remove opacidade/filtro dos dias
        el.querySelectorAll(".grid > div").forEach((dayDiv) => {
          dayDiv.style.opacity = "";
          dayDiv.style.filter = "";
        });
      });
      const isSelected = monthDiv.classList.contains("selected");
      // Se já está selecionado, desmarcar tudo
      if (isSelected) {
        return;
      }
      // Destacar mês clicado
      container.querySelectorAll(".calendar-month").forEach((el, i) => {
        el.classList.remove("selected");
        el.classList.remove("faded");
        // Remover legenda de eventos se houver
        const legend = el.querySelector(".month-events-legend");
        if (legend) legend.remove();
      });
      monthDiv.classList.add("selected");
      container.querySelectorAll(".calendar-month").forEach((el, i) => {
        if (i !== idx) el.classList.add("faded");
      });
      // Montar lista de eventos do mês (agrupando faixas)
      const monthData = calendarData.months[idx];
      const events = [];
      monthData.days.forEach((day) => {
        day.events.forEach((ev) => {
          events.push({
            date: day.date,
            text: ev.text,
            type: ev.type,
          });
        });
      });
      // Agrupar eventos iguais em faixas
      let grouped = [];
      let i = 0;
      while (i < events.length) {
        const curr = events[i];
        let j = i + 1;
        while (
          j < events.length &&
          events[j].text === curr.text &&
          events[j].type === curr.type &&
          events[j].date === events[j - 1].date + 1
        ) {
          j++;
        }
        if (j - i > 1) {
          grouped.push({
            range: [events[i].date, events[j - 1].date],
            text: curr.text,
          });
        } else {
          grouped.push({
            range: [curr.date],
            text: curr.text,
          });
        }
        i = j;
      }
      // Criar HTML da legenda interna
      let html = `<div class='month-events-legend'>`;
      if (grouped.length === 0) {
        html += "<div>Nenhum evento neste mês.</div>";
      } else {
        grouped.forEach((ev) => {
          if (ev.range.length === 1) {
            html += `<div><b>${String(ev.range[0]).padStart(2, "0")}</b> - ${
              ev.text
            }</div>`;
          } else {
            html += `<div><b>${String(ev.range[0]).padStart(2, "0")}-${String(
              ev.range[1]
            ).padStart(2, "0")}</b> - ${ev.text}</div>`;
          }
        });
      }
      html += "</div>";
      // Inserir legenda abaixo do mês selecionado
      monthDiv.insertAdjacentHTML("beforeend", html);
    });
  });
}

// Run when the page loads
document.addEventListener("DOMContentLoaded", initializeCalendar);

document.addEventListener("click", function (e) {
  // Se não clicou em um mês nem em um botão de bimestre
  if (
    !e.target.closest(".calendar-month") &&
    !e.target.classList.contains("bimestre-btn")
  ) {
    // Limpa seleção de bimestre
    document
      .querySelectorAll(".bimestre-btn")
      .forEach((b) => b.classList.remove("bg-blue-400", "text-white"));
    // Remove destaques/desfoques/legendas de todos os meses
    document.querySelectorAll(".calendar-month").forEach((m) => {
      m.classList.remove("selected", "faded");
      m.querySelectorAll(".grid > div").forEach((dayDiv) => {
        dayDiv.style.opacity = "";
        dayDiv.style.filter = "";
      });
      const legend = m.querySelector(".month-events-legend");
      if (legend) legend.remove();
    });
  }
});

function showBimestreTotalDias(bimestre) {
  const span = document.getElementById("bimestreTotalDias");
  if (span) {
    const dias = bimestreRanges[bimestre]?.dias;
    span.textContent = dias ? `${dias} dias` : "";
  }
}