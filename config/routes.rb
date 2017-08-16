GovukPublishingComponents::Engine.routes.draw do
  root :to => 'component_guide#index', as: :component_guide
  get ':component/preview' => 'component_guide#preview', as: :component_preview_all
  get ':component/:fixture/preview' => 'component_guide#preview', as: :component_preview
  get ':component' => 'component_guide#show', as: :component_doc
  get ':component/:fixture' => 'component_guide#fixture', as: :component_fixture
end
