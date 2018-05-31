module GovukTableHelper
  def govuk_table(caption = nil)
    builder = TableBuilder.new(tag)

    tag.table class: "govuk-table" do
      concat tag.caption caption, class: "govuk-table__caption"
      yield(builder)
    end
  end

  class TableBuilder
    attr_reader :tag

    def initialize(tag)
      @tag = tag
    end

    def head
      tag.thead class: "govuk-table__head" do
        tag.tr class: "govuk-table__row" do
          yield(self)
        end
      end
    end

    def body
      tag.tbody class: "govuk-table__body" do
        yield(self)
      end
    end

    def row
      tag.tr class: "govuk-table__row" do
        yield(self)
      end
    end

    def header(str)
      tag.th str, class: "govuk-table__header", scope: "col"
    end

    def cell(str)
      tag.td str, class: "govuk-table__cell"
    end
  end
end
