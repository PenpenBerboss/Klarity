"use client";

import React, { useState } from 'react';
import { 
  BookOpen, Search, ShieldCheck, Database, Server, 
  BarChart3, Activity, Users, HelpCircle, Layers, 
  CheckCircle2, ArrowRight, Workflow, Code, ChevronRight,
  Target, FileText, Bell, Clock, Compass
} from 'lucide-react';

export function TutorialTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'overview' | 'kpis' | 'glossary' | 'roles'>('overview');

  const kpisList = [
    {
      title: "Projets Actifs (Active Projects)",
      code: "PRJ_ACTIVE",
      description: "Mesure le nombre total de projets en phase de développement ou de livraison dans la plateforme.",
      formula: "Nombre total de projets avec statut 'on_track', 'delayed' ou 'at_risk'",
      importance: "Permet de contrôler le niveau d'encours global de l'organisation et d'éviter le sur-engagement des ressources.",
      target: "Variable selon la capacité de l'équipe (Recommandé: 3 à 7 projets simultanés)."
    },
    {
      title: "Livrables Mensuels (Monthly Deliverables)",
      code: "DELIV_M",
      description: "Nombre de jalons (milestones) et fonctionnalités majeures livrés et validés au cours du mois glissant.",
      formula: "Somme des jalons complétés + tâches marquées 'done' dans les 30 derniers jours",
      importance: "Indicateur clé de débit de valeur (throughput) delivered to stakeholders.",
      target: "≥ 15 livrables / mois"
    },
    {
      title: "Variance Budgétaire (Budget Variance)",
      code: "BUD_VAR",
      description: "Écart en pourcentage entre le budget réellement consommé et le budget prévisionnel alloué aux projets.",
      formula: "((Budget Consommé - Budget Prévu) / Budget Prévu) × 100",
      importance: "Indicateur de santé financière. Un écart positif supérieur à +10% alerte sur un risque de dépassement budgétaire.",
      target: "Entre -5% et +5%"
    },
    {
      title: "Taux de Charge Équipe (Team Workload)",
      code: "WRK_LOAD",
      description: "Pourcentage moyen d'utilisation des capacités humaines de l'ensemble des membres de l'équipe.",
      formula: "(Somme des capacités affectées aux membres / Nombre de membres) × 100",
      importance: "Permet d'identifier l'épuisement (surcharge > 100%) ou la sous-utilisation (< 50%) des collaborateurs.",
      target: "70% - 85% (Zone optimale)"
    },
    {
      title: "Vélocité des Sprints (Sprint Velocity)",
      code: "SPR_VEL",
      description: "Volume de Story Points ou nombre de tâches complétées avec succès à la fin de chaque itération.",
      formula: "Nombre de points / tâches terminés lors du dernier sprint clôturé",
      importance: "Permet d'estimer avec précision la capacité de livraison pour les futurs sprints et plannings release.",
      target: "Sustained / Croissance régulée (+5% à +10% par quarter)"
    },
    {
      title: "Score de Santé Global (Global Health Score)",
      code: "HLTH_SCR",
      description: "Indice synthétique agrégé sur 100 évaluant la performance opérationnelle, budgétaire et le respect des jalons.",
      formula: "Pondération: (30% Projets dans les temps) + (30% Respect Budget) + (20% Charge Équipe) + (20% Tâches non bloquées)",
      importance: "Donne aux dirigeants une vision instantanée à 360° de la performance globale de l'entreprise.",
      target: "≥ 80 / 100"
    }
  ];

  const glossaryTerms = [
    {
      term: "KPI (Key Performance Indicator)",
      abbreviation: "KPI",
      definition: "Indicateur Clé de Performance. Mesure chiffrée permettant d'évaluer le degré d'atteinte d'un objectif stratégique ou opérationnel."
    },
    {
      term: "MVP (Minimum Viable Product)",
      abbreviation: "MVP",
      definition: "Produit Minimum Viable. Version initiale d'une application comportant uniquement les fonctionnalités fondamentales nécessaires pour répondre aux besoins utilisateurs de base."
    },
    {
      term: "ERP (Enterprise Resource Planning)",
      abbreviation: "ERP",
      definition: "Progiciel de Gestion Intégré. Système d'information permettant de gérer et de suivre l'ensemble des processus d'une entreprise (finance, RH, logistique)."
    },
    {
      term: "Sprint",
      abbreviation: "SPR",
      definition: "Période de temps fixe (généralement 1 à 3 semaines) pendant laquelle l'équipe s'engage à concevoir et livrer un ensemble défini de fonctionnalités."
    },
    {
      term: "Kanban",
      abbreviation: "KANBAN",
      definition: "Méthode de gestion visuelle des flux de travail sous forme de colonnes (À faire, En cours, En revue, Terminé) permettant de limiter le travail en cours (WIP)."
    },
    {
      term: "Milestone (Jalon)",
      abbreviation: "MLST",
      definition: "Point de contrôle critique ou événement majeur marquant l'achèvement d'une phase clé dans un projet (ex: Validation de l'architecture, Version Beta)."
    },
    {
      term: "Actionable Task (Point de blocage)",
      abbreviation: "ACT_TSK",
      definition: "Tâche en situation de blocage ou de risque nécessitant une intervention managériale immédiate pour débloquer la chaîne de livraison."
    },
    {
      term: "RBAC (Role-Based Access Control)",
      abbreviation: "RBAC",
      definition: "Gestion des accès basée sur les rôles de l'utilisateur (Administrateur, Chef de Projet, Développeur, Visiteur) garantissant la sécurité des données."
    }
  ];

  const filteredKPIs = kpisList.filter(k => 
    k.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    k.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGlossary = glossaryTerms.filter(g =>
    g.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold">
            <BookOpen size={14} /> Documentation Officielle &amp; Guide d&apos;Utilisation
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Centre de Connaissance Klarity
          </h1>
          <p className="max-w-2xl text-indigo-100 text-sm sm:text-base leading-relaxed">
            Découvrez le fonctionnement complet de la plateforme Klarity, la définition rigoureuse des indicateurs KPI, le glossaire des concepts de gestion de projet et le guide pratique par rôle.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
              <input
                type="text"
                placeholder="Rechercher un KPI, un concept, une abréviation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-indigo-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeSection === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Server size={16} /> Architecture &amp; Backend
        </button>
        <button
          onClick={() => setActiveSection('kpis')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeSection === 'kpis'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <BarChart3 size={16} /> Guide des KPIs
        </button>
        <button
          onClick={() => setActiveSection('glossary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeSection === 'glossary'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <HelpCircle size={16} /> Glossaire & Concepts
        </button>
        <button
          onClick={() => setActiveSection('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeSection === 'roles'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Users size={16} /> Guide par Rôle
        </button>
      </div>

      {/* SECTION 1: ARCHITECTURE & BACKEND */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
              <Database size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Architecture Temps Réel & Persistence des Données
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              La plateforme Klarity est construite selon une architecture full-stack Next.js moderne et performante. Les données ne contiennent aucun contenu statique simulé (mock data) : chaque action utilisateur (ajout de tâche, création de membre, réassignation, modification de projet) est envoyée directement vers les routes d&apos;API serveur <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">/api/*</code> et stockée de façon permanente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm">
                  <Code size={16} className="text-indigo-500" /> Endpoints API Rest
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  API HTTP pour <code className="text-indigo-500">/api/team</code>, <code className="text-indigo-500">/api/projects</code>, <code className="text-indigo-500">/api/tasks</code>, <code className="text-indigo-500">/api/sprints</code> et <code className="text-indigo-500">/api/notifications</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm">
                  <Bell size={16} className="text-emerald-500" /> Notifications Automatiques
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Système d&apos;évènements qui génère automatiquement des notifications lors des modifications de statut, réassignations ou ajouts de tâches.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm">
                  <ShieldCheck size={16} className="text-amber-500" /> Intégrité des Données
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Synchronisation bidirectionnelle garantissant que toutes les opérations restent enregistrées même après rechargement.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs space-y-3">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                <Workflow size={18} className="text-indigo-600 dark:text-indigo-400" /> Flux d&apos;Exécution
              </h3>
              <ol className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <span>L&apos;utilisateur effectue une action dans l&apos;interface (ex: créer un projet ou inviter un membre par e-mail).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <span>Le frontend envoie une requête HTTP POST/PUT/DELETE aux API routes de Next.js (<code className="text-indigo-500">/api/*</code>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <span>Le serveur traite la demande, valide les types et écrit les changements dans la base de données.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">4</span>
                  <span>Une notification d&apos;activité système est instantanément déclenchée et affichée dans le centre de notifications.</span>
                </li>
              </ol>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs space-y-3">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                <Layers size={18} className="text-indigo-600" /> Structure de la Base de Données
              </h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/40">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span><strong>Users & Team :</strong> Identifiants, postes, départements, capacité, e-mail.</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/40">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span><strong>Projects & Milestones :</strong> Statuts, progressions, budgets, managers, jalons.</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/40">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span><strong>Tasks & Subtasks :</strong> Priorités, échéances, sous-tâches, assignés, commentaires.</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/40">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span><strong>Sprints & Timeline :</strong> Périodes d&apos;itération Agile et planification temporelle.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: GUIDE DES KPIS */}
      {activeSection === 'kpis' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Guide Complet des Indicateurs Clés de Performance (KPIs)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Les KPIs présentés sur le tableau de bord fournissent une visibilité synthétique et fiable sur l&apos;état de santé globale de votre entreprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredKPIs.map((kpi, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                      {kpi.code}
                    </span>
                    <Target size={18} className="text-gray-400" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {kpi.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {kpi.description}
                  </p>
                  
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 font-mono text-gray-700 dark:text-gray-300">
                      <strong>Formule :</strong> {kpi.formula}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <strong>Signification Business :</strong> {kpi.importance}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                  <span>Cible Recommandée :</span>
                  <span>{kpi.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: GLOSSAIRE */}
      {activeSection === 'glossary' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Glossaire des Termes & Concepts Métier
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Retrouvez l&apos;explication de tous les termes techniques, acronymes et méthodologies employés dans Klarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                    {item.term}
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {item.abbreviation}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: GUIDE PAR RÔLE */}
      {activeSection === 'roles' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Guide d&apos;Utilisation par Rôle Utilisateur
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Découvrez les flux de travail optimaux adaptés à vos responsabilités au sein de l&apos;organisation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Manager */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Compass size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Manager de Projet / CEO
                </h3>
                <p className="text-xs text-gray-500">Supervision globale, livraisons & budgets</p>
              </div>

              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span>Consulter le Tableau de bord pour suivre le <strong>Score de Santé Global</strong> et la <strong>Variance Budgétaire</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span>Créer de nouveaux projets et fixer les jalons clés dans l&apos;onglet <strong>Projets</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span>Générer et exporter les rapports PDF mensuels depuis l&apos;onglet <strong>Rapports</strong>.</span>
                </li>
              </ul>
            </div>

            {/* Lead Developer */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Code size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Lead Developer / Tech Lead
                </h3>
                <p className="text-xs text-gray-500">Organisation technique, sprints & charge</p>
              </div>

              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-purple-500 shrink-0 mt-0.5" />
                  <span>Planifier les Sprints dans l&apos;onglet <strong>Tâches (Vue Planning)</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-purple-500 shrink-0 mt-0.5" />
                  <span>Gérer la charge de travail des développeurs dans l&apos;onglet <strong>Équipe</strong> et réassigner les tâches si nécessaire.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-purple-500 shrink-0 mt-0.5" />
                  <span>Suivre les dépendances entre tâches dans la vue <strong>Timeline</strong>.</span>
                </li>
              </ul>
            </div>

            {/* Team Member */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Membre d&apos;Équipe / Développeur
                </h3>
                <p className="text-xs text-gray-500">Exécution des tâches au quotidien</p>
              </div>

              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Consulter le Tableau Kanban pour visualiser les tâches à effectuer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Mettre à jour le statut des tâches (À faire &rarr; En cours &rarr; En revue &rarr; Terminé).</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Ajouter des commentaires et cocher les sous-tâches complétées.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
