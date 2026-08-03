const EMAIL = "gabriel.nizeyimana.videoediting@gmail.com";


// Toutes les réalisations du dossier Google Drive, sauf la vidéo retirée.
const projects = [{"title":"Save The Date","category":"Mariage","meta":"Film court · Horizontal","description":"Un film court construit autour de l’élégance, de l’attente et de l’émotion du moment.","poster":"assets/posters/save-the-date.jpg","preview":"assets/previews/save-the-date.mp4","video":"assets/videos/save-the-date.mp4","source":"local"},{"title":"Ancienne Belgique","category":"Événement","meta":"Aftermovie · Vertical","description":"Un montage vertical qui restitue l’énergie de la scène, du public et des coulisses.","poster":"assets/posters/ancienne-belgique.jpg","preview":"assets/previews/ancienne-belgique.mp4","video":"assets/videos/ancienne-belgique.mp4","source":"local"},{"title":"African Queen","category":"Musique","meta":"Performance · Vertical","description":"Un montage musical centré sur la présence, le mouvement et l’identité visuelle de la performance.","poster":"assets/posters/african-queen.jpg","preview":"assets/previews/african-queen.mp4","video":"assets/videos/african-queen.mp4","source":"local"},{"title":"Amahgauche","category":"Musique","meta":"Clip · Vertical","description":"Un contenu vertical dynamique pensé autour du rythme, des attitudes et de l’impact visuel.","poster":"assets/posters/amahgauche.jpg","preview":"assets/previews/amahgauche.mp4","video":"assets/videos/amahgauche.mp4","source":"local"},{"title":"Foot Short","category":"Sport","meta":"Format court · Vertical","description":"Un montage sportif rapide construit pour transmettre l’intensité, l’action et le mouvement.","poster":"assets/posters/foot-short.jpg","preview":"assets/previews/foot-short.mp4","video":"assets/videos/foot-short.mp4","source":"local"},{"title":"Love","category":"Cinématique","meta":"Émotion · Storytelling","description":"Un montage centré sur l’atmosphère, les regards et les détails qui donnent du poids à l’histoire.","poster":"assets/posters/love.jpg","preview":"assets/previews/love.mp4","video":"assets/videos/love.mp4","source":"local"},{"title":"Save The Date — V1","category":"Mariage","meta":"Annonce · Cinématique","description":"Une seconde proposition de film d’annonce, pensée pour créer de l’attente et marquer la date.","poster":"assets/posters/save-the-date-v1.jpg","preview":"assets/previews/save-the-date-v1.mp4","video":"assets/videos/save-the-date-v1.mp4","source":"local"},{"title":"Noirs et Fières","category":"Culture","meta":"Identité · Storytelling","description":"Une réalisation culturelle forte, portée par le rythme, l’identité et la mise en valeur des sujets.","poster":"assets/posters/noirs-et-fieres.jpg","preview":"assets/previews/noirs-et-fieres.mp4","video":"assets/videos/noirs-et-fieres.mp4","source":"local"},{"title":"Agis","category":"Campagne","meta":"Impact · Message","description":"Un montage conçu pour porter un message clairement et donner de l’impact aux images.","poster":"assets/posters/agis.jpg","preview":"assets/previews/agis.mp4","video":"assets/videos/agis.mp4","source":"local"},{"title":"Baddie","category":"Lifestyle","meta":"Mode · Format court","description":"Un montage court et affirmé, construit autour de l’attitude, du style et des changements de rythme.","poster":"assets/posters/baddie.jpg","preview":"assets/previews/baddie.mp4","video":"assets/videos/baddie.mp4","source":"local"},{"title":"MJ","category":"Musique","meta":"Hommage · Performance","description":"Un montage musical porté par l’énergie de la performance et une progression rythmique précise.","poster":"assets/posters/mj.jpg","preview":"assets/previews/mj.mp4","video":"assets/videos/mj.mp4","source":"local"},{"title":"Paname","category":"Urbain","meta":"Format court · Dynamique","description":"Un montage urbain rapide, pensé pour les réseaux sociaux et construit autour du mouvement.","poster":"assets/posters/paname.jpg","preview":"assets/previews/paname.mp4","video":"assets/videos/paname.mp4","source":"local"}];

const grid = document.getElementById("projectGrid");

function projectCards(groupLabel, hidden = false) {
  const cards = projects.map((p,index)=>{
    const sourceAttrs = `src="${p.preview}"`;

    return `<article class="project-card ${index % 4 === 0 ? "is-wide" : "is-tall"} is-local" data-project="${index}" tabindex="${hidden ? "-1" : "0"}" role="button" aria-label="Voir ${p.title}">
      <div class="project-media">
        <img src="${p.poster}" alt="Miniature de ${p.title}" loading="${index<3&&!hidden?'eager':'lazy'}">
        <video class="project-preview" muted loop playsinline preload="metadata" poster="${p.poster}" ${sourceAttrs}></video>
        <div class="preview-status" aria-hidden="true">
          <span class="preview-status-dot"></span>
          <span class="preview-status-text">Aperçu vidéo</span>
        </div>
        <div class="project-top"><span class="project-category">${p.category}</span><span class="project-index">${String(index+1).padStart(2,'0')}</span></div>
        <div class="project-bottom"><div><p>${p.meta}</p><h3>${p.title}</h3></div><span class="project-play">↗</span></div>
      </div>
    </article>`;
  }).join("");
  return `<div class="project-group" ${hidden ? 'aria-hidden="true"' : `aria-label="${groupLabel}"`}>${cards}</div>`;
}
grid.innerHTML = `<div class="project-scroller">${projectCards("Réalisations")}${projectCards("Réalisations dupliquées", true)}</div>`;

const projectScroller = grid.querySelector(".project-scroller");
const finePointer = matchMedia("(pointer:fine)").matches;

// Défilement infini piloté en JavaScript : fiable dans Chrome, Edge, Safari, Firefox
// et même lorsque Windows active « Réduire les animations ».
function startInfiniteTicker(track, groupSelector, speed, direction = -1) {
  if (!track) return;

  const firstGroup = track.querySelector(groupSelector);
  if (!firstGroup) return;

  let offset = 0;
  let groupWidth = 0;
  let lastTime = performance.now();
  let rafId = 0;

  const measure = () => {
    groupWidth = firstGroup.getBoundingClientRect().width;
    if (direction > 0 && offset === 0 && groupWidth) offset = -groupWidth;
  };

  const frame = now => {
    const delta = Math.min(50, now - lastTime);
    lastTime = now;

    if (!document.hidden && groupWidth > 0) {
      offset += direction * speed * (delta / 1000);

      if (direction < 0 && offset <= -groupWidth) offset += groupWidth;
      if (direction > 0 && offset >= 0) offset -= groupWidth;

      track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
    }

    rafId = requestAnimationFrame(frame);
  };

  measure();
  addEventListener("resize", measure, {passive:true});
  document.fonts?.ready?.then(measure).catch(()=>{});
  rafId = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(rafId);
}

const mobileTicker = matchMedia("(max-width:640px)").matches;
startInfiniteTicker(document.querySelector(".marquee-track"), ".marquee-group", mobileTicker ? 54 : 76, -1);
startInfiniteTicker(document.querySelector(".work-marquee-track"), ".work-marquee-group", mobileTicker ? 48 : 66, 1);
startInfiniteTicker(projectScroller, ".project-group", mobileTicker ? 31 : 42, -1);

function preparePreview(card){
  const video=card.querySelector(".project-preview");
  if(!video)return null;
  if(video.readyState>=2)card.classList.add("preview-ready");
  else video.addEventListener("loadeddata",()=>card.classList.add("preview-ready"),{once:true});
  return video;
}

function playCard(card){
  const video=preparePreview(card);
  if(!video||card.classList.contains("preview-error"))return;

  video.muted=true;
  const promise=video.play();
  if(promise){
    promise.then(()=>{
      card.classList.add("is-playing","preview-ready");
    }).catch(()=>{});
  }
}

function stopCard(card){
  const video=card.querySelector(".project-preview");
  if(!video)return;
  video.pause();
  card.classList.remove("is-playing");
}

document.querySelectorAll(".project-card").forEach(card=>{
  if(finePointer){
    card.addEventListener("mouseenter",()=>playCard(card));
    card.addEventListener("mouseleave",()=>stopCard(card));
  }

  const open=()=>openProject(Number(card.dataset.project));
  card.addEventListener("click",open);
  card.addEventListener("keydown",e=>{
    if(e.key==="Enter"||e.key===" "){
      e.preventDefault();
      open();
    }
  });
});

const visibleCards=document.querySelectorAll(".project-group:first-child .project-card");
const previewObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      preparePreview(entry.target);
      if(!finePointer)playCard(entry.target);
    }else if(!finePointer){
      stopCard(entry.target);
    }
  });
},{root:null,rootMargin:"180px",threshold:.35});

visibleCards.forEach(card=>previewObserver.observe(card));

const modal=document.getElementById("projectModal"),modalVideo=document.getElementById("modalVideo"),modalTitle=document.getElementById("modalTitle"),modalDescription=document.getElementById("modalDescription"),modalCategory=document.getElementById("modalCategory");
function openProject(index){
  const p=projects[index];
  if(!p)return;

  modalTitle.textContent=p.title;
  modalDescription.textContent=p.description;
  modalCategory.innerHTML=`<i></i> ${p.category}`;
  modalVideo.innerHTML="";

  const stage=document.createElement("div");
  stage.className="media-stage direct-video-stage";
  stage.innerHTML=`
    <img class="media-stage-poster" src="${p.poster}" alt="">
    <div class="media-stage-indicator" aria-live="polite">
      <span></span>
      <small>Préparation de la vidéo…</small>
    </div>
  `;
  modalVideo.appendChild(stage);

  const video=document.createElement("video");
  video.controls=true;
  video.autoplay=true;
  video.playsInline=true;
  video.preload="auto";
  video.poster=p.poster;
  video.src=p.video;
  stage.appendChild(video);

  const ready=()=>{
    stage.classList.add("is-ready");
    video.play().catch(()=>{});
  };

  video.addEventListener("loadeddata",ready,{once:true});
  video.addEventListener("canplay",ready,{once:true});

  video.addEventListener("error",()=>{
    stage.classList.add("has-error");
    const indicator=stage.querySelector(".media-stage-indicator");
    indicator.innerHTML=`
      <strong>Vidéo introuvable</strong>
      <small>Vérifie que le dossier assets/videos est bien présent.</small>
    `;
  },{once:true});

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}
function closeProject(){modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");modalVideo.innerHTML="";document.body.style.overflow="";}
document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",closeProject));document.addEventListener("keydown",e=>{if(e.key==="Escape")closeProject();});

// Showreel unique : trois vidéos se remplacent dans le même cadre.
const reelVideos=[...document.querySelectorAll(".showreel-video")],reelDots=[...document.querySelectorAll(".showreel-dots i")];let reelIndex=0;setInterval(()=>{reelVideos[reelIndex].classList.remove("is-active");reelDots[reelIndex].classList.remove("is-active");reelIndex=(reelIndex+1)%reelVideos.length;reelVideos[reelIndex].classList.add("is-active");reelDots[reelIndex].classList.add("is-active");reelVideos[reelIndex].play().catch(()=>{});},4300);

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target);}}),{threshold:.1});document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));
const copyEmail=document.getElementById("copyEmail"),copyStatus=document.getElementById("copyStatus");copyEmail.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(EMAIL);}catch{const input=document.createElement("textarea");input.value=EMAIL;document.body.appendChild(input);input.select();document.execCommand("copy");input.remove();}copyStatus.textContent="Adresse e-mail copiée.";setTimeout(()=>copyStatus.textContent="",2400);});
const progress=document.querySelector(".page-progress span");addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${max?scrollY/max*100:0}%`;},{passive:true});
