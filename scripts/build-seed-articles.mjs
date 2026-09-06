// Génère supabase/seed_articles.sql à partir des données ci-dessous.
// Usage : node scripts/build-seed-articles.mjs
import { writeFileSync } from "node:fs";

const ADMIN_ID = "d60b6dbb-56c8-416d-b54c-780b5ce08f41";

function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sqlEscape(str) {
  return str.replace(/'/g, "''");
}

function tiptapDoc(paragraphs) {
  return JSON.stringify({
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  });
}

const A = {
  societe: [
    {
      title: "À Kaloum, les marchandes de fruits s'organisent en coopérative d'achat",
      excerpt: "Quarante commerçantes ont mutualisé leurs commandes pour négocier directement avec les producteurs de la Basse-Côte.",
      body: [
        "L'idée est née d'un constat simple : achetées séparément, les caisses coûtaient à chacune 15 à 20 % de plus qu'en gros.",
        "La coopérative regroupe aujourd'hui quarante commerçantes. Les commandes partent une fois par semaine, la répartition se fait au petit matin, avant l'ouverture des étals.",
        "D'autres groupes du même marché observent l'expérience de près, notamment du côté des vendeuses de poisson fumé.",
      ],
    },
    {
      title: "Les quartiers périphériques réclament l'extension du ramassage des ordures",
      excerpt: "Des collectifs de riverains demandent l'élargissement du service de collecte, aujourd'hui concentré sur le centre-ville.",
      body: [
        "Dans plusieurs quartiers de la périphérie, les dépôts sauvages s'accumulent faute de passage régulier des camions de collecte.",
        "Les associations de quartier ont déposé une pétition commune, appuyée par un relevé photographique des points noirs recensés sur trois mois.",
        "Les autorités municipales évoquent un plan d'extension progressif, sans calendrier ferme pour l'instant.",
      ],
    },
    {
      title: "Un réseau de puits communautaires soulage l'accès à l'eau en saison sèche",
      excerpt: "Douze puits équipés de pompes manuelles ont été remis en service dans les localités les plus touchées par les coupures.",
      body: [
        "La remise en état des puits, financée par une collecte locale, a permis de réduire les distances de marche pour aller chercher l'eau.",
        "Un comité de gestion assure désormais l'entretien et la répartition des tours d'eau aux heures de forte affluence.",
        "Les habitants espèrent que l'initiative inspirera d'autres quartiers confrontés au même problème.",
      ],
    },
    {
      title: "Le marché central de nuit gagne en fréquentation depuis l'installation de l'éclairage public",
      excerpt: "L'ajout de lampadaires solaires a prolongé l'activité commerçante bien après la tombée de la nuit.",
      body: [
        "Depuis l'installation d'une trentaine de lampadaires solaires, les allées du marché restent fréquentées jusque tard dans la soirée.",
        "Les commerçants notent une hausse sensible de leur chiffre d'affaires sur le créneau du soir, auparavant délaissé par prudence.",
        "La sécurité s'est également améliorée, selon les premiers retours des vendeuses interrogées.",
      ],
    },
    {
      title: "Les jeunes du quartier lancent une brigade de médiation pour désamorcer les tensions de voisinage",
      excerpt: "Une trentaine de volontaires ont été formés à l'écoute et à la résolution de conflits de proximité.",
      body: [
        "Face à la multiplication des différends de voisinage, un groupe de jeunes a mis en place une brigade de médiation bénévole.",
        "Après une formation de trois jours, les médiateurs interviennent désormais en binôme, sur sollicitation des familles concernées.",
        "Le bilan des premiers mois est jugé encourageant par les responsables du quartier, qui envisagent d'étendre le dispositif.",
      ],
    },
  ],
  politique: [
    {
      title: "Budget rectificatif : les débats s'ouvrent sur la part réservée aux collectivités",
      excerpt: "Les élus locaux réclament un mécanisme de transfert automatique plutôt que des dotations négociées chaque année.",
      body: [
        "L'examen du texte a commencé dans un climat tendu. La question des transferts aux collectivités locales occupe l'essentiel des échanges.",
        "Les maires plaident pour une clé de répartition fixe, indexée sur la population et le linéaire de voirie, qui rendrait les budgets locaux prévisibles.",
        "Un groupe de travail mixte doit rendre ses conclusions avant la fin de la session.",
      ],
    },
    {
      title: "Décentralisation : un rapport propose de renforcer les pouvoirs fiscaux des communes",
      excerpt: "Le document, remis cette semaine, suggère d'élargir la liste des taxes que les communes peuvent lever elles-mêmes.",
      body: [
        "Le rapport, commandé il y a un an, dresse un état des lieux jugé sévère de la dépendance financière des communes vis-à-vis de l'État central.",
        "Parmi les recommandations, l'élargissement de l'assiette des taxes locales et la simplification des procédures de recouvrement.",
        "Les associations d'élus locaux saluent globalement les propositions, tout en réclamant un calendrier de mise en œuvre précis.",
      ],
    },
    {
      title: "Réforme électorale : la révision des listes se heurte à des retards administratifs",
      excerpt: "Plusieurs centres d'enrôlement signalent des difficultés techniques qui ralentissent la mise à jour des listes.",
      body: [
        "La campagne de révision, censée s'achever dans les prochaines semaines, accuse un retard estimé à plusieurs jours dans certaines localités.",
        "Les autorités en charge du processus évoquent des problèmes de connectivité sur les terminaux d'enregistrement biométrique.",
        "Des renforts techniques ont été annoncés pour les centres les plus affectés.",
      ],
    },
    {
      title: "Un projet de loi sur la transparence des marchés publics soumis à consultation",
      excerpt: "Le texte prévoit la publication systématique des appels d'offres et des attributions au-delà d'un certain seuil.",
      body: [
        "Le projet de loi, mis en consultation publique, vise à renforcer la traçabilité des marchés publics au-delà d'un seuil fixé par décret.",
        "Les organisations de la société civile saluent l'initiative tout en demandant des sanctions plus dissuasives en cas de manquement.",
        "La version finale du texte devrait être présentée en conseil des ministres dans les prochaines semaines.",
      ],
    },
    {
      title: "Coopération régionale : un accord technique attendu sur la gestion partagée des bassins versants",
      excerpt: "Les discussions portent sur la coordination des prélèvements d'eau entre pays voisins en période de sécheresse.",
      body: [
        "Les délégations techniques se sont retrouvées pour une nouvelle session de négociation sur la gestion partagée des cours d'eau transfrontaliers.",
        "L'enjeu porte notamment sur la coordination des prélèvements agricoles et industriels en période de sécheresse prolongée.",
        "Un accord-cadre pourrait être signé lors du prochain sommet régional.",
      ],
    },
  ],
  sport: [
    {
      title: "Le Syli national arrache le nul et garde la main sur sa qualification",
      excerpt: "Menés jusqu'à la 78e minute, les Guinéens ont égalisé sur un corner. Le groupe reste jouable avant le déplacement décisif.",
      body: [
        "Le stade était plein bien avant le coup d'envoi. Il aura fallu attendre le dernier quart d'heure pour que le public y trouve son compte.",
        "Dominés dans l'entrejeu pendant une mi-temps entière, les Guinéens ont changé de visage après l'heure de jeu.",
        "Avec ce point, la sélection conserve son destin en main. Le déplacement du mois prochain décidera de tout.",
      ],
    },
    {
      title: "Championnat national : le calendrier de la phase retour dévoilé",
      excerpt: "La billetterie en ligne ouvre en même temps que la publication du calendrier complet de la seconde partie de saison.",
      body: [
        "Le calendrier complet de la phase retour a été publié en même temps que l'ouverture de la billetterie en ligne.",
        "Les affiches de la première journée sont déjà connues des clubs, qui entament leur préparation spécifique.",
        "La fédération promet un dispositif renforcé pour les rencontres jugées à risque.",
      ],
    },
    {
      title: "Basket-ball : la sélection féminine s'impose en amical face à une nation voisine",
      excerpt: "Une victoire nette qui confirme la progression du groupe avant les qualifications régionales.",
      body: [
        "Les basketteuses ont dominé leur rencontre amicale de bout en bout, portées par une adresse retrouvée à trois points.",
        "Le sélectionneur se dit satisfait de la profondeur de banc, un point faible identifié lors des précédentes sorties.",
        "Le groupe enchaînera avec un stage de préparation avant les qualifications régionales du mois prochain.",
      ],
    },
    {
      title: "Athlétisme : un jeune sprinteur guinéen s'illustre sur le circuit sous-régional",
      excerpt: "Le coureur de 19 ans a amélioré son record personnel sur 100 mètres lors d'un meeting international.",
      body: [
        "Peu connu avant cette saison, le sprinteur a surpris son monde en descendant sous la barre symbolique qu'il visait depuis deux ans.",
        "Son entraîneur évoque un travail de fond entamé après une blessure qui avait interrompu sa progression.",
        "Le jeune athlète est désormais suivi de près par la fédération en vue des prochaines échéances continentales.",
      ],
    },
    {
      title: "Le futsal amateur se structure autour d'un nouveau championnat de quartier",
      excerpt: "Douze équipes de Conakry participent à la première édition d'un tournoi organisé sur plusieurs week-ends.",
      body: [
        "Le tournoi, organisé par un collectif d'anciens joueurs, réunit douze équipes issues de différents quartiers de la capitale.",
        "L'objectif affiché est de repérer de jeunes talents tout en offrant un cadre encadré à une pratique jusque-là informelle.",
        "Les organisateurs espèrent pérenniser l'évènement sous forme de championnat annuel.",
      ],
    },
  ],
  culture: [
    {
      title: "Le festival des arts de Kindia annonce trois jours de programmation en plein air",
      excerpt: "Musique mandingue, danse contemporaine et projections : la scène principale sera installée sur l'esplanade du centre-ville.",
      body: [
        "La programmation vient d'être dévoilée. Trois scènes, une trentaine de formations, une majorité d'artistes venus des régions.",
        "Une journée entière sera consacrée aux ateliers : percussions, kora, écriture de chanson, ouverts gratuitement aux scolaires.",
        "Les projections de fin de soirée mettront à l'honneur des documentaires guinéens récents, suivis de rencontres avec les réalisateurs.",
      ],
    },
    {
      title: "Une exposition retrace un siècle de photographie de rue à Conakry",
      excerpt: "Plus de deux cents clichés, dont beaucoup inédits, sont rassemblés dans une galerie du centre-ville.",
      body: [
        "L'exposition rassemble des tirages issus de collections privées, certains jamais montrés au public jusqu'ici.",
        "Le parcours chronologique permet de suivre l'évolution urbaine de la capitale sur plus de cent ans.",
        "Les organisateurs espèrent faire tourner l'exposition dans d'autres villes du pays d'ici la fin de l'année.",
      ],
    },
    {
      title: "Un roman guinéen sélectionné pour un grand prix littéraire régional",
      excerpt: "L'auteure, originaire de Labé, voit son premier roman distingué parmi une sélection de dix ouvrages.",
      body: [
        "Le roman, publié il y a un an, aborde le parcours d'une famille entre exode rural et vie urbaine.",
        "La sélection a surpris l'auteure elle-même, qui décrit une écriture nourrie de récits familiaux recueillis pendant plusieurs années.",
        "Le prix sera décerné lors d'une cérémonie régionale dans quelques semaines.",
      ],
    },
    {
      title: "La rénovation du théâtre de verdure s'achève après deux ans de travaux",
      excerpt: "L'équipement historique rouvrira ses portes avec une nouvelle capacité d'accueil et une scène agrandie.",
      body: [
        "Fermé depuis deux ans pour rénovation, le théâtre de verdure retrouve une scène agrandie et des gradins remis à neuf.",
        "La programmation de réouverture mêlera troupes locales et compagnies invitées des pays voisins.",
        "Les riverains, longtemps privés d'animation culturelle de proximité, attendent la réouverture avec impatience.",
      ],
    },
    {
      title: "Le cinéma guinéen mise sur les formats courts pour toucher un public jeune",
      excerpt: "Une nouvelle génération de réalisateurs privilégie des films de moins de vingt minutes, diffusés en ligne.",
      body: [
        "Portés par la baisse du coût du matériel de tournage, plusieurs jeunes réalisateurs se sont tournés vers le format court.",
        "La diffusion se fait essentiellement en ligne, avec des audiences parfois supérieures à celles des salles traditionnelles.",
        "Un collectif envisage désormais d'organiser une soirée de projection mensuelle ouverte au public.",
      ],
    },
  ],
  economie: [
    {
      title: "Le corridor Conakry–Kankan rouvre à la circulation lourde après huit mois de travaux",
      excerpt: "Les 380 kilomètres réhabilités ramènent le trajet à moins de huit heures. Les transporteurs attendent la révision des tarifs de fret.",
      body: [
        "La réouverture du corridor a été annoncée en fin de semaine. Les derniers kilomètres, longtemps impraticables en saison des pluies, ont été bitumés.",
        "Pour les transporteurs, le gain est immédiat : le trajet, qui pouvait dépasser quatorze heures, redescend sous la barre des huit.",
        "Reste la question de l'entretien. Le budget de maintenance annuel n'a pas encore été arbitré.",
      ],
    },
    {
      title: "Anacarde : la campagne s'annonce sous tension à Boké",
      excerpt: "Coopératives et exportateurs s'opposent sur le prix bord champ à quelques semaines de l'ouverture de la campagne.",
      body: [
        "Les premières discussions entre coopératives et exportateurs n'ont pas permis de s'accorder sur un prix de référence.",
        "Les producteurs réclament un prix plancher garanti, tandis que les exportateurs évoquent la volatilité des cours mondiaux.",
        "Un médiateur régional a été sollicité pour tenter de rapprocher les positions avant le début de la récolte.",
      ],
    },
    {
      title: "Les tontines numériques gagnent du terrain auprès des petits commerçants",
      excerpt: "Des applications locales digitalisent un mécanisme d'épargne collective très répandu dans les marchés urbains.",
      body: [
        "Le principe reste celui de la tontine traditionnelle : un groupe cotise à tour de rôle et chacun perçoit le pot à son tour.",
        "La version numérique ajoute un suivi automatisé des versements et des rappels par message, réduisant les litiges internes.",
        "Plusieurs groupes de commerçantes ont adopté l'outil au cours des derniers mois, avec des retours globalement positifs.",
      ],
    },
    {
      title: "Zone CEDEAO : un accord technique facilite le transit des marchandises",
      excerpt: "Le document harmonise les formalités douanières sur cinq corridors majeurs de la sous-région.",
      body: [
        "Le protocole technique a été validé par les administrations douanières des États concernés, sur cinq corridors routiers.",
        "Concrètement, un document de transit unique doit remplacer les déclarations successives à chaque frontière.",
        "Les premières applications concerneront les corridors les plus fréquentés, avant une généralisation progressive.",
      ],
    },
    {
      title: "Le secteur de la pêche artisanale demande un accès facilité au crédit",
      excerpt: "Les organisations professionnelles réclament des lignes de financement adaptées au renouvellement des pirogues motorisées.",
      body: [
        "Le vieillissement de la flotte artisanale inquiète les organisations professionnelles, qui peinent à financer le renouvellement du matériel.",
        "Les taux proposés par les établissements classiques restent jugés inadaptés à la saisonnalité des revenus du secteur.",
        "Une concertation avec les institutions de microfinance doit démarrer dans les prochaines semaines.",
      ],
    },
  ],
  technologie: [
    {
      title: "Les start-up guinéennes misent sur le hors-ligne d'abord pour toucher l'intérieur du pays",
      excerpt: "Applications qui fonctionnent sans réseau, synchronisation différée, paiement par Mobile Money : des outils pensés pour le terrain.",
      body: [
        "Dans les ateliers de développement de Conakry, une contrainte revient dans toutes les conversations : la connexion ne tient pas.",
        "Le schéma est désormais bien rodé. L'application stocke localement, affiche immédiatement, puis synchronise quand le réseau revient.",
        "Le défi suivant est commercial : convaincre des commerçants habitués au cahier papier que le passage au numérique ne les rendra pas dépendants d'une connexion qu'ils n'ont pas.",
      ],
    },
    {
      title: "Énergie solaire connectée : des onduleurs qui remontent leurs pannes avant la coupure",
      excerpt: "Des capteurs suivent l'état des batteries et alertent le technicien par message avant la défaillance.",
      body: [
        "Le principe est celui de la maintenance prédictive appliquée au solaire domestique, avec un module de mesure sur chaque installation.",
        "Les données remontent par GSM lorsque le réseau le permet, et sont mises en file d'attente le reste du temps.",
        "L'enjeu économique est direct : un remplacement de parc de batteries coûte plusieurs fois le prix d'une intervention préventive.",
      ],
    },
    {
      title: "Un incubateur régional ouvre un programme dédié à l'agritech",
      excerpt: "Dix équipes sélectionnées bénéficieront d'un accompagnement de six mois sur des projets liés à l'agriculture connectée.",
      body: [
        "Le programme cible spécifiquement les projets liés à la collecte de données agricoles et à l'optimisation des chaînes d'approvisionnement.",
        "Les dix équipes retenues, issues de plusieurs pays de la sous-région, bénéficieront d'un mentorat technique et commercial.",
        "Une démo day est prévue à l'issue des six mois pour présenter les projets à des investisseurs potentiels.",
      ],
    },
    {
      title: "La couverture 4G s'étend vers plusieurs préfectures de l'intérieur",
      excerpt: "Un opérateur annonce l'activation de nouveaux sites dans des zones jusque-là limitées à la 2G.",
      body: [
        "L'extension du réseau doit permettre à plusieurs chefs-lieux de préfecture d'accéder pour la première fois à une connexion mobile haut débit.",
        "Les commerçants locaux y voient une opportunité pour développer la vente en ligne et les paiements mobiles.",
        "L'opérateur promet une couverture complète des zones concernées d'ici la fin de l'année.",
      ],
    },
    {
      title: "Des développeurs guinéens créent un outil de traduction pour les langues locales",
      excerpt: "Le projet, encore en phase de test, vise à faciliter l'accès à l'information dans plusieurs langues nationales.",
      body: [
        "L'équipe, composée de linguistes et de développeurs bénévoles, a constitué un corpus de textes dans plusieurs langues nationales.",
        "L'outil, encore expérimental, propose des traductions de base à destination des services publics et des médias locaux.",
        "Les porteurs du projet cherchent désormais des partenaires pour enrichir le corpus et améliorer la précision des traductions.",
      ],
    },
  ],
  education: [
    {
      title: "Baccalauréat : les épreuves anticipées avancées de deux semaines",
      excerpt: "Le calendrier officiel a été publié. Les centres d'examen de la région de Conakry passeront en premier.",
      body: [
        "Le calendrier a été rendu public par les services des examens. Les épreuves anticipées démarreront deux semaines plus tôt que l'an dernier.",
        "Les chefs d'établissement disent avoir été prévenus tardivement et révisent leurs plannings de composition blanche.",
        "Les centres de la région de Conakry composeront en premier, suivis des régions de l'intérieur selon un échelonnement de trois jours.",
      ],
    },
    {
      title: "Un programme de bourses cible les filières scientifiques dans les lycées ruraux",
      excerpt: "Cinquante élèves bénéficieront d'un accompagnement renforcé jusqu'au baccalauréat.",
      body: [
        "Le programme, financé par un partenariat public-privé, cible des élèves repérés pour leurs résultats en mathématiques et en physique.",
        "Outre la bourse, les bénéficiaires auront accès à des séances de tutorat hebdomadaires assurées par des étudiants universitaires.",
        "Les organisateurs espèrent que le dispositif encouragera davantage de vocations scientifiques dans les zones rurales.",
      ],
    },
    {
      title: "Les bibliothèques mobiles reprennent leurs tournées dans les zones enclavées",
      excerpt: "Trois camions aménagés desserviront une quinzaine de localités pendant les vacances scolaires.",
      body: [
        "Les bibliothèques mobiles, à l'arrêt depuis plusieurs mois faute de financement, reprennent leurs tournées cette semaine.",
        "Chaque camion transporte plusieurs centaines d'ouvrages, renouvelés à chaque étape grâce à un système de rotation entre véhicules.",
        "L'initiative cible en priorité les localités dépourvues de bibliothèque fixe.",
      ],
    },
    {
      title: "Une université lance une filière courte en maintenance des équipements solaires",
      excerpt: "La formation, sur dix-huit mois, doit répondre à une demande croissante de techniciens qualifiés.",
      body: [
        "La nouvelle filière, ouverte à la rentrée prochaine, formera des techniciens capables d'installer et d'entretenir des équipements solaires domestiques.",
        "Le programme a été conçu en concertation avec plusieurs entreprises du secteur, qui se disent en tension sur ce type de profil.",
        "Une trentaine de places seront ouvertes pour la première promotion.",
      ],
    },
    {
      title: "Les résultats du concours d'entrée en école de santé publiés avec un mois d'avance",
      excerpt: "L'anticipation du calendrier doit permettre aux admis de préparer leur rentrée dans de meilleures conditions.",
      body: [
        "Les résultats du concours d'entrée, très attendus chaque année, ont été publiés avec un mois d'avance sur le calendrier habituel.",
        "Les responsables de l'école évoquent une réorganisation du processus de correction pour expliquer ce gain de temps.",
        "Les candidats admis ont jusqu'à la fin du mois pour confirmer leur inscription.",
      ],
    },
  ],
  sante: [
    {
      title: "Campagne de vaccination élargie : douze nouveaux centres mobiles déployés",
      excerpt: "Les équipes couvriront les sous-préfectures les plus éloignées pendant six semaines.",
      body: [
        "Douze équipes mobiles ont pris la route cette semaine, avec pour objectif de couvrir les sous-préfectures les plus éloignées.",
        "Chaque équipe compte un vaccinateur, un agent de saisie et un relais communautaire chargé de l'annonce des passages.",
        "Un bilan intermédiaire est attendu à mi-parcours, à la troisième semaine de la campagne.",
      ],
    },
    {
      title: "Un centre de santé communautaire ouvre ses portes dans un quartier périphérique",
      excerpt: "La structure, portée par une association locale, propose des consultations à tarif réduit.",
      body: [
        "Le centre, financé par une collecte associative et un appui institutionnel partiel, propose des consultations généralistes à tarif réduit.",
        "Une file d'attente s'est formée dès les premières heures d'ouverture, signe d'un besoin manifeste dans le quartier.",
        "Les responsables espèrent recruter un second médecin d'ici la fin de l'année pour absorber la demande.",
      ],
    },
    {
      title: "La lutte contre le paludisme s'appuie désormais sur un réseau de relais communautaires",
      excerpt: "Formés à la détection précoce, ces relais orientent les cas suspects vers les centres de santé les plus proches.",
      body: [
        "Le réseau de relais communautaires, formé sur plusieurs sessions, couvre désormais une trentaine de villages.",
        "Leur rôle consiste à repérer les premiers symptômes et à orienter rapidement les patients vers un centre de santé.",
        "Les premiers résultats montrent une réduction du délai moyen entre l'apparition des symptômes et la prise en charge.",
      ],
    },
    {
      title: "Une unité mobile de dépistage sillonne les marchés pour sensibiliser au diabète",
      excerpt: "L'initiative propose des tests rapides gratuits couplés à des conseils nutritionnels.",
      body: [
        "L'unité mobile s'installe chaque semaine sur un marché différent, proposant des tests de glycémie gratuits et rapides.",
        "Les personnes dépistées positives sont orientées vers un suivi médical et reçoivent des conseils nutritionnels adaptés.",
        "Les organisateurs notent une fréquentation en hausse constante depuis le lancement de l'initiative.",
      ],
    },
    {
      title: "Santé maternelle : la formation des sages-femmes rurales renforcée",
      excerpt: "Un nouveau module de formation continue cible la gestion des urgences obstétricales en zone isolée.",
      body: [
        "Le module de formation, dispensé sur trois semaines, cible en priorité les sages-femmes exerçant dans les zones les plus isolées.",
        "L'accent est mis sur la gestion des urgences obstétricales en l'absence de moyens d'évacuation rapide.",
        "Les formatrices espèrent former plusieurs dizaines de sages-femmes supplémentaires dans les prochains mois.",
      ],
    },
  ],
  international: [
    {
      title: "Zone CEDEAO : un sommet extraordinaire consacré à la libre circulation",
      excerpt: "Les chefs d'État doivent examiner un rapport sur les obstacles persistants à la circulation des personnes et des biens.",
      body: [
        "Le sommet extraordinaire portera sur l'application effective des textes relatifs à la libre circulation dans l'espace communautaire.",
        "Un rapport préliminaire pointe la persistance de contrôles non harmonisés à plusieurs postes frontières.",
        "Les conclusions du sommet devraient déboucher sur un plan d'action assorti d'échéances précises.",
      ],
    },
    {
      title: "Une délégation régionale participe à une conférence internationale sur le climat",
      excerpt: "Les négociateurs porteront une position commune sur le financement de l'adaptation dans les pays côtiers.",
      body: [
        "La délégation régionale, composée de représentants de plusieurs pays côtiers, portera une position commune sur le financement climatique.",
        "L'accent sera mis sur les besoins spécifiques d'adaptation face à la montée des eaux et à l'érosion côtière.",
        "Les résultats des négociations seront présentés lors d'un point presse en marge de la conférence.",
      ],
    },
    {
      title: "Accord bilatéral sur la formation professionnelle signé avec un pays partenaire",
      excerpt: "Le texte prévoit l'accueil de stagiaires dans des filières techniques jugées prioritaires.",
      body: [
        "L'accord, signé après plusieurs mois de négociation, prévoit l'accueil annuel d'un contingent de stagiaires dans des filières techniques.",
        "Les secteurs prioritaires identifiés incluent la maintenance industrielle et les énergies renouvelables.",
        "Les premiers départs sont prévus dans les prochains mois, sous réserve de la validation des dossiers.",
      ],
    },
    {
      title: "La diaspora mobilisée pour un fonds d'investissement dédié aux infrastructures locales",
      excerpt: "L'initiative vise à canaliser une partie des transferts de fonds vers des projets communautaires structurants.",
      body: [
        "Le fonds, encore en phase de constitution, vise à canaliser une partie des transferts de la diaspora vers des projets communautaires.",
        "Les porteurs de l'initiative promettent une gouvernance transparente, avec des comités locaux chargés du suivi des projets financés.",
        "Une première levée de fonds test doit être lancée dans les prochains mois auprès des associations de la diaspora.",
      ],
    },
    {
      title: "Un partenariat portuaire régional ambitionne de réduire les délais de transbordement",
      excerpt: "Trois ports de la sous-région coordonnent désormais leurs plannings pour fluidifier le trafic de conteneurs.",
      body: [
        "Le partenariat entre les trois autorités portuaires prévoit un partage régulier des données de trafic pour anticiper les pics de congestion.",
        "Les opérateurs logistiques saluent une initiative susceptible de réduire les délais d'attente aux quais.",
        "Un premier bilan du dispositif est attendu après six mois de fonctionnement.",
      ],
    },
  ],
};

const CATEGORY_NAMES = {
  societe: "Société",
  politique: "Politique",
  sport: "Sport",
  culture: "Culture",
  economie: "Économie",
  technologie: "Technologie",
  education: "Éducation",
  sante: "Santé",
  international: "International",
};

const rows = [];
let counter = 0;
const daysStep = 0.6;

for (const [catSlug, articles] of Object.entries(A)) {
  articles.forEach((art, idx) => {
    counter += 1;
    const slug = slugify(art.title);
    const daysAgo = counter * daysStep;
    const isFeatured = counter === 3; // one featured article overall
    const viewCount = 40 + Math.floor(Math.random() * 900) + (isFeatured ? 3000 : 0);
    const imageSeed = `ast-media-${counter}`;
    rows.push({
      title: art.title,
      slug,
      excerpt: art.excerpt,
      content: tiptapDoc(art.body),
      cover: `https://picsum.photos/seed/${imageSeed}/1200/675`,
      catSlug,
      isFeatured,
      viewCount,
      daysAgo,
    });
  });
}

const values = rows
  .map((r) => {
    return `(
  '${sqlEscape(r.title)}',
  '${r.slug}',
  '${sqlEscape(r.excerpt)}',
  '${sqlEscape(r.content)}'::jsonb,
  '${r.cover}',
  (select id from public.categories where slug = '${r.catSlug}'),
  '${ADMIN_ID}',
  'published',
  ${r.isFeatured ? "true" : "false"},
  ${r.viewCount},
  now() - interval '${r.daysAgo} days'
)`;
  })
  .join(",\n");

const sql = `-- AST Media — articles de démonstration (${rows.length} articles)
insert into public.articles
  (title, slug, excerpt, content, cover_image_url, category_id, author_id, status, is_featured, view_count, published_at)
values
${values}
on conflict (slug) do nothing;
`;

writeFileSync(new URL("../supabase/seed_articles.sql", import.meta.url), sql, "utf-8");
console.log(`Généré : supabase/seed_articles.sql (${rows.length} articles)`);
