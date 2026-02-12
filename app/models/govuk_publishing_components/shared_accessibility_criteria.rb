module GovukPublishingComponents
  module SharedAccessibilityCriteria
    def self.link
      "
Links in the component must:

- accept focus
- be focusable with a keyboard
- be usable with a keyboard
- indicate when they have focus
- change in appearance when touched (in the touch-down state)
- change in appearance when hovered
- be usable with touch
- be usable with [voice commands](https://www.w3.org/WAI/perspectives/voice.html)
- have visible text
- have meaningful text
      "
    end

    def self.button
      "
Buttons in the component must:

- accept focus
- be focusable with a keyboard
- be usable with a keyboard
- indicate when they have focus
- change in appearance when touched (in the touch-down state)
- change in appearance when hovered
- be usable with touch
- be usable with [voice commands](https://www.w3.org/WAI/perspectives/voice.html)
- have visible text
- have meaningful text
      "
    end

    def self.table
      "
Accessible tables need HTML markup that indicates header cells and data cells and defines their relationship. Assistive technologies use this information to provide context to users.
Header cells must be marked up with `<th>`, and data cells with `<td>` to make tables accessible.
For more complex tables, explicit associations is needed using scope attributes.
      "
    end
  end
end
