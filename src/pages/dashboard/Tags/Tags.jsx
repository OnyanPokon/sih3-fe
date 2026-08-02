import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space, Tag as AntTag } from 'antd';
import { Tags as TagModel } from '@/models';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { formFields, REFERENCE_TYPES } from './FormFields.js';
import TagsService from '@/services/TagsService.js';
import { debounce } from 'lodash';

const { DELETE, UPDATE, READ } = Action;

const Tags = () => {
  const modal = useCrudModal();
  const { setFormFields } = modal;
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllTags } = useAbortableService(TagsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllTags.totalData });
  const [filterValues, setFilterValues] = useState({ search: '' });

  const [referenceOptions, setReferenceOptions] = useState([]);
  const [isReferenceLoading, setIsReferenceLoading] = useState(false);
  const [activeRefType, setActiveRefType] = useState('wilayah_sungai');

  const fetchReferenceOptions = useCallback(
    async (searchQuery = '', refType = 'wilayah_sungai', initialItem = null) => {
      if (!refType) {
        setReferenceOptions([]);
        return;
      }

      const refConfig = REFERENCE_TYPES.find((t) => t.value === refType);
      if (!refConfig || !refConfig.service) {
        setReferenceOptions([]);
        return;
      }

      setIsReferenceLoading(true);
      try {
        const { response, parser } = refConfig.service.getAll({ token, per_page: 10, search: searchQuery });
        const res = await response;
        let rawData = parser ? parser(res?.data) : (res?.data?.data ?? res?.data ?? []);

        const labelKey = refConfig.labelKey || 'name';
        const valueKey = refConfig.valueKey || 'id';

        let options = (Array.isArray(rawData) ? rawData : []).map((item) => ({
          label: item[labelKey] || item.name || item.nama || String(item[valueKey]),
          value: item[valueKey]
        }));

        if (initialItem && initialItem.id && !options.some((o) => o.value === initialItem.id)) {
          options.unshift({
            label: initialItem[labelKey] || initialItem.name || initialItem.nama || String(initialItem.id),
            value: initialItem.id
          });
        }

        setReferenceOptions(options);
      } catch (err) {
        console.error('Error fetching reference options:', err);
        setReferenceOptions([]);
      } finally {
        setIsReferenceLoading(false);
      }
    },
    [token]
  );

  const debouncedSearchReference = useMemo(() => {
    return debounce((val) => {
      fetchReferenceOptions(val, activeRefType);
    }, 400);
  }, [fetchReferenceOptions, activeRefType]);

  const currentFormFields = useMemo(() => {
    return formFields({
      referenceOptions,
      onSearchReference: debouncedSearchReference,
      isReferenceLoading
    });
  }, [referenceOptions, debouncedSearchReference, isReferenceLoading]);

  // Update modal form fields when reference options change dynamically
  useEffect(() => {
    if (setFormFields) {
      setFormFields(currentFormFields);
    }
  }, [currentFormFields, setFormFields]);

  const handleModalChange = useCallback(
    (realtimeData) => {
      if (realtimeData?.reference_type && realtimeData.reference_type !== activeRefType) {
        setActiveRefType(realtimeData.reference_type);
        fetchReferenceOptions('', realtimeData.reference_type);
      }
    },
    [activeRefType, fetchReferenceOptions]
  );

  const fetchTags = useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const [selectedData, setSelectedData] = useState([]);
  const tags = getAllTags.data ?? [];

  const storeTag = useService(TagsService.store, onUnauthorized);
  const updateTag = useService(TagsService.update, onUnauthorized);
  const deleteTag = useService(TagsService.delete, onUnauthorized);

  const column = [
    {
      title: 'Nama Tag',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      searchable: true,
      render: (_, record) => <AntTag color="blue">{record.name}</AntTag>
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      render: (text) => text || '-'
    },
    {
      title: 'Referensi Object',
      render: (_, record) => {
        if (!record.reference_type) return <span className="text-gray-400">-</span>;
        const matchedType = REFERENCE_TYPES.find((t) => t.value === record.reference_type);
        const typeLabel = matchedType ? matchedType.label : record.reference_type;
        const refName = record.reference?.name || record.reference?.nama || record.reference_id || '';
        return (
          <div className="flex items-center gap-1">
            <AntTag color="green">{typeLabel}</AntTag>
            {refName && <span className="text-xs font-semibold text-gray-700">{refName}</span>}
          </div>
        );
      }
    },
    {
      title: 'Pembuat',
      render: (_, record) => record.user?.username || '-'
    }
  ];

  if (user && user.eitherCan([UPDATE, TagModel], [DELETE, TagModel], [READ, TagModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.TAG}`}
            model={TagModel}
            onClick={() => {
              const refType = record.reference_type || 'wilayah_sungai';
              setActiveRefType(refType);
              fetchReferenceOptions('', refType, record.reference);

              modal.edit({
                title: `Edit ${Modul.TAG}`,
                data: {
                  ...record,
                  name: record.name,
                  description: record.description,
                  reference_type: record.reference_type,
                  reference_id: record.reference_id
                },
                formFields: currentFormFields,
                onChange: handleModalChange,
                onSubmit: async (values) => {
                  const payload = {
                    ...values,
                    reference_id: values.reference_type ? values.reference_id : null
                  };
                  const { message, isSuccess } = await updateTag.execute(record.id, payload, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchTags();
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.TAG}`}
            model={TagModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.TAG}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteTag.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchTags();
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    });
  }

  const onCreate = () => {
    setActiveRefType('wilayah_sungai');
    fetchReferenceOptions('', 'wilayah_sungai');
    modal.create({
      title: `Tambah ${Modul.TAG}`,
      formFields: currentFormFields,
      onChange: handleModalChange,
      onSubmit: async (values) => {
        const payload = {
          ...values,
          reference_id: values.reference_type ? values.reference_id : null
        };
        const { message, isSuccess } = await storeTag.execute(payload, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchTags();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card
      title={
        <DataTableHeader
          model={TagModel}
          modul={Modul.TAG}
          onStore={onCreate}
          selectedData={selectedData}
          onSearch={(values) => setFilterValues({ ...filterValues, search: values })}
        />
      }
    >
      <Skeleton loading={getAllTags.isLoading}>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={tags}
            columns={column}
            loading={getAllTags.isLoading}
            map={(tag) => ({ key: tag.id, ...tag })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            pagination={pagination}
          />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Tags;
