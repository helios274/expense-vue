from django_filters import (
    FilterSet, DateFromToRangeFilter, ChoiceFilter, RangeFilter
)
from transactions.models import Transaction
from utils import constants


class TransactionFilterSet(FilterSet):
    # filter by transaction type
    transaction_type = ChoiceFilter(
        field_name="type",
        choices=constants.TRANSACTION_TYPES
    )

    # filter by account type
    account_type = ChoiceFilter(
        field_name="account__account_type",
        choices=constants.ACCOUNT_TYPES
    )

    # filter by amount_min and amount_max
    amount = RangeFilter()

    # filter by account_balance_min and account_balance_max
    account_balance = RangeFilter()

    # filter by date_before and date_after
    date = DateFromToRangeFilter()

    class Meta:
        model = Transaction
        fields = ["tags", "category", "amount"]
