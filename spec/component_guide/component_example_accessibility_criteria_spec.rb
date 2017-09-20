require "spec_helper"

describe 'Component examples with accessibility criteria' do
  it 'shows the accessibility acceptance criteria as html using static’s govspeak component' do
    visit '/component-guide/test-component'

    within ".component-accessibility-criteria" do
      expect(page).to have_selector('h2', text: 'Accessibility acceptance criteria')

      within(shared_component_selector("govspeak")) do
        content = JSON.parse(page.text).fetch("content").squish
        expect(content).to include('<li>This is some criteria in a list</li>')
      end
    end
  end

  it 'shows shared accessibility criteria' do
    visit '/component-guide/test-component-with-shared-accessibility-criteria'

    within '.component-accessibility-criteria' do
      within(shared_component_selector("govspeak")) do
        content = JSON.parse(page.text).fetch("content").squish
        expect(content).to eq('<ul> <li>This is some criteria in a list</li> </ul> <p>Links in the component must:</p> <ul> <li>accept focus</li> <li>be focusable with a keyboard</li> <li>be usable with a keyboard</li> <li>indicate when they have focus</li> <li>change in appearance when touched (in the touch-down state)</li> <li>change in appearance when hovered</li> <li>be usable with touch</li> <li>be usable with <a rel="external" href="https://www.w3.org/WAI/perspectives/voice.html">voice commands</a> </li> <li>have visible text</li> </ul>')
      end
    end
  end

  it 'shows shared accessibility criteria when no other accessibility criteria are included' do
    visit '/component-guide/test-component-with-shared-accessibility-criteria-only'

    within '.component-accessibility-criteria' do
      within(shared_component_selector("govspeak")) do
        content = JSON.parse(page.text).fetch("content").squish
        expect(content).to eq('<p>Links in the component must:</p> <ul> <li>accept focus</li> <li>be focusable with a keyboard</li> <li>be usable with a keyboard</li> <li>indicate when they have focus</li> <li>change in appearance when touched (in the touch-down state)</li> <li>change in appearance when hovered</li> <li>be usable with touch</li> <li>be usable with <a rel="external" href="https://www.w3.org/WAI/perspectives/voice.html">voice commands</a> </li> <li>have visible text</li> </ul>')
      end
    end
  end
end
