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
        get_margin_bottom(@options[:margin_bottom]) if @options.include?(:margin_bottom)
      end

      def all_attributes
        attributes = {}

        attributes[:id] = @options[:id] unless @options[:id].blank?
        attributes[:data] = @options[:data_attributes] unless @options[:data_attributes].blank?
        attributes[:aria] = @options[:aria] unless @options[:aria].blank?
        attributes[:class] = @options[:classes] unless @options[:classes].blank?
        attributes[:role] = @options[:role] unless @options[:role].blank?
        attributes[:lang] = @options[:lang] unless @options[:lang].blank?
        attributes[:open] = @options[:open] unless @options[:open].blank?
        attributes[:hidden] = @options[:hidden] unless @options[:hidden].nil?
        attributes[:tabindex] = @options[:tabindex] unless @options[:tabindex].blank?
        attributes[:dir] = @options[:dir] unless @options[:dir].blank?

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

      def get_margin_bottom(margin_bottom)
        add_class("govuk-!-margin-bottom-#{margin_bottom}") if [*0..9].include?(margin_bottom)
      end

    private

      def check_id_is_valid(id)
        return if id.blank?

        raise(ArgumentError, "Id (#{id}) cannot start with a number or contain whitespace and can only contain letters, digits, `_` and `-`") unless /\A[a-zA-Z][\w:-]*\z/.match?(id)
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
        unless class_array.all? { |c| c.start_with?("js-", "gem-c-", "govuk-", "app-c-", "brand--", "brand__") || c == "direction-rtl" }
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

        langs = %w[ab aa af ak sq am ar an hy as av ae ay az bm ba eu be bn bh bi bs br bg my ca ch ce ny zh zh-Hans zh-Hant cv kw co cr hr cs da dv nl dz en eo et ee fo fj fi fr ff gl gd gv ka de el kl gn gu ht ha he hz hi ho hu is io ig id in ia ie iu ik ga it ja jv kl kn kr ks kk km ki rw rn ky kv kg ko ku kj lo la lv li ln lt lu lg lb gv mk mg ms ml mt mi mr mh mo mn na nv ng nd ne no nb nn ii oc oj cu or om os pi ps fa pl pt pa qu rm ro ru se sm sg sa sr sh st tn sn ii sd si ss sk sl so nr es su sw ss sv tl ty tg ta tt te th bo ti to ts tr tk tw ug uk ur uz ve vi vo wa cy wo fy xh yi ji yo za zu]
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

      def check_dir_is_valid(dir_attribute)
        return if dir_attribute.nil?

        options = %w[ltr rtl auto]
        unless options.include? dir_attribute
          raise(ArgumentError, "dir attribute (#{dir_attribute}) is not recognised")
        end
      end

      def extend_string(option, string)
        ((@options[option] ||= "") << " #{string}").strip!
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
