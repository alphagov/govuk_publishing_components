module GovukPublishingComponents
  module Presenters
    class ComponentWrapperHelper
      def initialize(options)
        @options = options

        check_id_is_valid(@options[:id]) if @options.include?(:id)
        check_data_attributes_are_valid(@options[:data_attributes]) if @options.include?(:data_attributes)
        check_classes_are_valid(@options[:classes]) if @options.include?(:classes)
        check_aria_is_valid(@options[:aria]) if @options.include?(:aria)
        check_role_is_valid(@options[:role]) if @options.include?(:role)
        check_lang_is_valid(@options[:lang]) if @options.include?(:lang)
        check_open_is_valid(@options[:open]) if @options.include?(:open)
        check_hidden_is_valid(@options[:hidden]) if @options.include?(:hidden)
        check_tabindex_is_valid(@options[:tabindex]) if @options.include?(:tabindex)
        check_dir_is_valid(@options[:dir]) if @options.include?(:dir)
        check_type_is_valid(@options[:type]) if @options.include?(:type)
        check_draggable_is_valid(@options[:draggable]) if @options.include?(:draggable)
        check_rel_is_valid(@options[:rel]) if @options.include?(:rel)
        check_target_is_valid(@options[:target]) if @options.include?(:target)
        check_margin_bottom_is_valid(@options[:margin_bottom]) if @options.include?(:margin_bottom)
      end

      def all_attributes
        attributes = {}

        attributes[:id] = @options[:id] if @options[:id].present?
        attributes[:data] = @options[:data_attributes] if @options[:data_attributes].present?
        attributes[:aria] = @options[:aria] if @options[:aria].present?

        ((@options[:classes] ||= "") << " govuk-!-margin-bottom-#{@options[:margin_bottom]}").strip! if @options[:margin_bottom]
        attributes[:class] = @options[:classes] if @options[:classes].present?

        attributes[:role] = @options[:role] if @options[:role].present?
        attributes[:lang] = @options[:lang] if @options[:lang].present?
        attributes[:open] = @options[:open] if @options[:open].present?
        attributes[:hidden] = @options[:hidden] unless @options[:hidden].nil?
        attributes[:tabindex] = @options[:tabindex] if @options[:tabindex].present?
        attributes[:dir] = @options[:dir] if @options[:dir].present?
        attributes[:type] = @options[:type] if @options[:type].present?
        attributes[:draggable] = @options[:draggable] if @options[:draggable].present?
        attributes[:rel] = @options[:rel] if @options[:rel].present?
        attributes[:target] = @options[:target] if @options[:target].present?
        attributes[:title] = @options[:title] if @options[:title].present?

        attributes
      end

      def set_id(id)
        check_id_is_valid(id)
        @options[:id] = id
      end

      def add_class(classes)
        check_classes_are_valid(classes)
        extend_string(:classes, classes)
      end

      def add_data_attribute(attributes)
        check_data_attributes_are_valid(attributes)
        extend_object(:data_attributes, attributes)
      end

      def add_aria_attribute(attributes)
        check_aria_is_valid(attributes)
        extend_object(:aria, attributes)
      end

      def add_role(role)
        check_role_is_valid(role)
        extend_string(:role, role)
      end

      def set_lang(lang)
        check_lang_is_valid(lang)
        @options[:lang] = lang
      end

      def set_open(open_attribute)
        check_open_is_valid(open_attribute)
        @options[:open] = open_attribute
      end

      def set_hidden(hidden_attribute)
        check_hidden_is_valid(hidden_attribute)
        @options[:hidden] = hidden_attribute
      end

      def set_tabindex(tabindex_attribute)
        check_tabindex_is_valid(tabindex_attribute)
        @options[:tabindex] = tabindex_attribute
      end

      def set_dir(dir_attribute)
        check_dir_is_valid(dir_attribute)
        @options[:dir] = dir_attribute
      end

      def set_type(type_attribute)
        check_type_is_valid(type_attribute)
        @options[:type] = type_attribute
      end

      def set_draggable(draggable_attribute)
        check_draggable_is_valid(draggable_attribute)
        @options[:draggable] = draggable_attribute
      end

      def add_rel(rel_attribute)
        check_rel_is_valid(rel_attribute)
        extend_string(:rel, rel_attribute)
      end

      def set_rel(rel_attribute)
        check_rel_is_valid(rel_attribute)
        @options[:rel] = rel_attribute
      end

      def set_target(target_attribute)
        check_target_is_valid(target_attribute)
        @options[:target] = target_attribute
      end

      def set_title(title_attribute)
        @options[:title] = title_attribute
      end

      def set_margin_bottom(margin_bottom)
        check_margin_bottom_is_valid(margin_bottom)
        @options[:margin_bottom] = margin_bottom
      end

    private

      def check_id_is_valid(id)
        return if id.blank?

        raise(ArgumentError, "Id (#{id}) cannot contain whitespace or `.` characters") if /[. \n]+/.match?(id)
      end

      def check_data_attributes_are_valid(attributes)
        return if attributes.blank?

        attributes_keys = attributes.map { |key, _| key.to_s }
        invalid_attributes = attributes_keys.map { |a| a if /^(xml)/.match?(a) || /[A-Z :]+/.match?(a) }.compact

        raise(ArgumentError, "Data attributes (#{invalid_attributes.join(', ')}) cannot contain capitals, spaces or colons, or start with 'xml'") if invalid_attributes.any?
      end

      def check_classes_are_valid(classes)
        return if classes.blank?

        class_array = classes.split(" ")
        unless class_array.all? { |c| c.start_with?("js-", "gem-c-", "govuk-", "app-c-", "brand--", "brand__", "gem-print-") || c == "direction-rtl" }
          raise(ArgumentError, "Classes (#{classes}) must be prefixed with `js-`")
        end
      end

      def check_aria_is_valid(attributes)
        return if attributes.blank?

        arias = %w[activedescendant atomic autocomplete busy checked colcount colindex colspan controls current describedby description details disabled dropeffect errormessage expanded flowto grabbed haspopup hidden invalid keyshortcuts label labelledby level live modal multiline multiselectable orientation owns placeholder posinset pressed readonly relevant required roledescription rowcount rowindex rowspan selected setsize sort valuemax valuemin valuenow valuetext]

        # array keys are immutable so we have to do this to make a copy, in order to
        # subtract valid aria attributes from invalid in the error message below
        attributes_keys = attributes.map { |key, _| key.to_s }

        unless attributes_keys.all? { |key| arias.include? key }
          raise(ArgumentError, "Aria attribute (#{(attributes_keys - arias).join(', ')}) not recognised")
        end
      end

      def check_role_is_valid(role)
        return if role.blank?

        roles = %w[alert alertdialog application article associationlist associationlistitemkey associationlistitemvalue banner blockquote caption cell code columnheader combobox complementary contentinfo definition deletion dialog directory document emphasis feed figure form group heading img insertion list listitem log main marquee math menu menubar meter navigation none note paragraph presentation region row rowgroup rowheader scrollbar search searchbox separator separator slider spinbutton status strong subscript superscript switch tab table tablist tabpanel term time timer toolbar tooltip tree treegrid treeitem]
        role = role.split(" ") # can have more than one role
        unless role.all? { |r| roles.include? r }
          raise(ArgumentError, "Role attribute (#{(role - roles).join(', ')}) is not recognised")
        end
      end

      def check_lang_is_valid(lang)
        return if lang.blank?

        langs = %w[ab aa af ak sq am ar an hy as av ae ay az bm ba eu be bn bh bi bs br bg my ca ch ce ny zh zh-Hans zh-Hant zh-hk zh-tw cv kw co cr hr cs da dv nl dz dr en eo et ee fo fj fi fr ff gl gd gv ka de el kl gn gu ht ha he hz hi ho hu is io ig id in ia ie iu ik ga it ja jv kl kn kr ks kk km ki rw rn ky kv kg ko ku kj lo la lv li ln lt lu lg lb gv mk mg ms ml mt mi mr mh mo mn na nv ng nd ne no nb nn ii oc oj cu or om os pi ps fa pl pt pa pa-pk qu rm ro ru se sm sg sa sr sh st tn sn ii sd si ss sk sl so nr es es-419 su sw ss sv tl ty tg ta tt te th bo ti to ts tr tk tw ug uk ur uz ve vi vo wa cy wo fy xh yi ji yo za zu]

        lang = lang.to_s

        unless langs.include? lang
          raise(ArgumentError, "lang attribute (#{lang}) is not recognised")
        end
      end

      def check_open_is_valid(open_attribute)
        return if open_attribute.blank?

        options = [true, false]
        unless options.include? open_attribute
          raise(ArgumentError, "open attribute (#{open_attribute}) is not recognised")
        end
      end

      def check_hidden_is_valid(hidden_attribute)
        return if hidden_attribute.nil?

        options = ["", "hidden", "until-found"]
        unless options.include? hidden_attribute
          raise(ArgumentError, "hidden attribute (#{hidden_attribute}) is not recognised")
        end
      end

      def check_tabindex_is_valid(tabindex_attribute)
        return if tabindex_attribute.blank?

        tabindex_attribute = tabindex_attribute.to_s

        unless /^-?[0-9]+$/.match?(tabindex_attribute)
          raise(ArgumentError, "tabindex_attribute attribute (#{tabindex_attribute}) is not recognised")
        end
      end

      def check_margin_bottom_is_valid(margin_bottom)
        raise(ArgumentError, "margin_bottom option (#{margin_bottom}) is not recognised") unless [*0..9].include?(margin_bottom)
      end

      def check_dir_is_valid(dir_attribute)
        return if dir_attribute.blank?

        options = %w[ltr rtl auto]
        unless options.include? dir_attribute
          raise(ArgumentError, "dir attribute (#{dir_attribute}) is not recognised")
        end
      end

      def check_type_is_valid(type_attribute)
        return if type_attribute.blank?

        options = %w[button checkbox color date datetime-local email file hidden image month number password radio range reset search submit tel text time url week]
        unless options.include? type_attribute
          raise(ArgumentError, "type attribute (#{type_attribute}) is not recognised")
        end
      end

      def check_draggable_is_valid(draggable_attribute)
        return if draggable_attribute.blank?

        options = %w[true false]
        unless options.include? draggable_attribute
          raise(ArgumentError, "draggable attribute (#{draggable_attribute}) is not recognised")
        end
      end

      def check_rel_is_valid(rel_attribute)
        return if rel_attribute.blank?

        options = %w[alternate author bookmark canonical dns-prefetch external expect help icon license manifest me modulepreload next nofollow noopener noreferrer opener pingback preconnect prefetch preload prerender prev privacy-policy search stylesheet tag terms-of-service]
        rel_array = rel_attribute.split(" ")
        unless rel_array.all? { |r| options.include? r }
          raise(ArgumentError, "rel attribute (#{rel_attribute}) is not recognised")
        end
      end

      def check_target_is_valid(target_attribute)
        return if target_attribute.blank?

        options = %w[_self _blank _parent _top _unfencedTop]
        unless options.include? target_attribute
          raise(ArgumentError, "target attribute (#{target_attribute}) is not recognised")
        end
      end

      def extend_string(option, string)
        @options[option] = "#{@options[option]} #{string}".strip
      end

      def extend_object(option, object)
        @options[option] ||= {}
        object.each_key do |key|
          @options[option][key] =
            if @options[option].key?(key)
              "#{@options[option][key]} #{object[key]}"
            else
              object[key]
            end
        end
      end
    end
  end
end
