/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroCinematic } from './components/HeroCinematic';
import { Studio360Configurator } from './components/Studio360Configurator';
import { FleetLineup } from './components/FleetLineup';
import { AcousticSimulator } from './components/AcousticSimulator';
import { InnovationHeritage } from './components/InnovationHeritage';
import { Footer } from './components/Footer';
import { TestDriveModal } from './components/TestDriveModal';
import { TechnicalSpecsModal } from './components/TechnicalSpecsModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { FLEET_MODELS } from './data/fleetData';
import { ModelSpec, CarColor, WheelOption, BrakeCaliperOption } from './types/bmw';

export default function App() {
  // Modal states
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStandaloneOpen, setIsStandaloneOpen] = useState(false);

  // Active contextual selections
  const [activeStudioModel, setActiveStudioModel] = useState<ModelSpec>(FLEET_MODELS[0]);
  const [selectedModelForSpecs, setSelectedModelForSpecs] = useState<ModelSpec | null>(
    FLEET_MODELS[0]
  );
  const [selectedModelForDrive, setSelectedModelForDrive] = useState<ModelSpec | null>(
    FLEET_MODELS[0]
  );
  const [customConfigNote, setCustomConfigNote] = useState<string>('');

  // Handlers
  const handleOpenSpecs = (model: ModelSpec) => {
    setSelectedModelForSpecs(model);
    setIsSpecsOpen(true);
  };

  const handleOpenTestDrive = (model?: ModelSpec) => {
    if (model) setSelectedModelForDrive(model);
    setIsTestDriveOpen(true);
  };

  const handleReserveCustomConfiguration = (config: {
    model: ModelSpec;
    color: CarColor;
    wheel: WheelOption;
    caliper: BrakeCaliperOption;
  }) => {
    setCustomConfigNote(
      `${config.model.name} in ${config.color.name} finish, with ${config.wheel.name} and ${config.caliper.name} brake calipers.`
    );
    setSelectedModelForDrive(config.model);
    setIsTestDriveOpen(true);
  };

  const handleSelectModelFor360 = (model: ModelSpec) => {
    setActiveStudioModel(model);
    scrollToSection('studio');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#0066B1] selection:text-white">
      {/* Header Bar */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTestDrive={() => handleOpenTestDrive()}
        onOpenStandalone={() => setIsStandaloneOpen(true)}
      />

      {/* Hero Cinematic Section with Live Telemetry */}
      <HeroCinematic
        onExploreStudio={() => scrollToSection('studio')}
        onExploreFleet={() => scrollToSection('fleet')}
        onExploreSound={() => scrollToSection('acoustics')}
        onBookTestDrive={() => handleOpenTestDrive(FLEET_MODELS[0])}
      />

      {/* Interactive 360° Studio & Color Configurator */}
      <Studio360Configurator
        activeModel={activeStudioModel}
        onSelectModel={setActiveStudioModel}
        onOpenSpecsModal={handleOpenSpecs}
        onReserveConfiguration={handleReserveCustomConfiguration}
      />

      {/* Fleet Lineup with Filters & Comparison Drawer */}
      <FleetLineup
        onSelectModelFor360={handleSelectModelFor360}
        onOpenSpecsModal={handleOpenSpecs}
        onBookTestDrive={handleOpenTestDrive}
      />

      {/* BMW M Acoustic & Engine Sound Simulator */}
      <AcousticSimulator />

      {/* Brand Heritage & Future Innovations */}
      <InnovationHeritage />

      {/* Footer */}
      <Footer
        onOpenStandalone={() => setIsStandaloneOpen(true)}
        onOpenTestDrive={() => handleOpenTestDrive()}
      />

      {/* Test Drive Reservation Modal */}
      <TestDriveModal
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
        preselectedModel={selectedModelForDrive}
        customConfigNote={customConfigNote}
      />

      {/* Technical Specifications Modal */}
      <TechnicalSpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        model={selectedModelForSpecs}
        onBookDrive={(model) => {
          setIsSpecsOpen(false);
          handleOpenTestDrive(model);
        }}
      />

      {/* Global Live Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectModel={(model) => {
          handleOpenSpecs(model);
        }}
        onSelectAcoustics={() => scrollToSection('acoustics')}
        onSelectInnovations={() => scrollToSection('innovations')}
      />

      {/* Standalone Pure HTML5 / CSS3 / Vanilla JS Modal & ZIP Exporter */}
      <StandaloneExportModal
        isOpen={isStandaloneOpen}
        onClose={() => setIsStandaloneOpen(false)}
      />
    </div>
  );
}
